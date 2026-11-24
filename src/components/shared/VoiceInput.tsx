import { useCallback, useEffect, useId, useRef, useState, type RefObject } from "react";
import "./VoiceInput.css";

const MAX_BYTES = 5 * 1024 * 1024;
const MAX_DURATION_MS = 90_000;
const SAMPLE_RATE = 16_000;
const MAX_SAMPLES = SAMPLE_RATE * MAX_DURATION_MS / 1000;
const TRANSCRIPTION_TIMEOUT_MS = 55_000;
const RECORDING_TYPES = ["audio/webm;codecs=opus", "audio/mp4", "audio/ogg;codecs=opus"];
const SUPPORTED_TYPES = new Set(["audio/webm", "audio/mp4", "audio/ogg", "audio/mpeg", "audio/wav"]);

type Phase = "idle" | "consent" | "requesting" | "recording" | "transcribing";

interface Recording {
    stream?: MediaStream;
    recorder?: MediaRecorder;
    controller?: AbortController;
    timer?: number;
}

interface VoiceInputProps {
    targetRef: RefObject<HTMLTextAreaElement | null>;
    onValueChange: (value: string, formatted: boolean) => void;
    onBusyChange: (busy: boolean) => void;
    disabled?: boolean;
}

const BUTTON_LABELS: Record<Phase, string> = {
    idle: "Продиктовать",
    consent: "Согласен, начать запись",
    requesting: "Запрашиваем микрофон…",
    recording: "Остановить запись",
    transcribing: "Расшифровываем…",
};

function releaseMicrophone(recording: Recording) {
    window.clearTimeout(recording.timer);
    recording.stream?.getTracks().forEach((track) => track.stop());
}

function dispose(recording: Recording) {
    recording.controller?.abort();
    if (recording.recorder && recording.recorder.state !== "inactive") recording.recorder.stop();
    releaseMicrophone(recording);
}

function encodeWave(audio: AudioBuffer): Blob {
    const frames = Math.min(audio.length, MAX_SAMPLES);
    const samples = new ArrayBuffer(44 + frames * 2);
    const header = new DataView(samples);
    const bytes = new Uint8Array(samples);
    const encoder = new TextEncoder();

    bytes.set(encoder.encode("RIFF"), 0);
    header.setUint32(4, samples.byteLength - 8, true);
    bytes.set(encoder.encode("WAVEfmt "), 8);
    header.setUint32(16, 16, true);
    header.setUint16(20, 1, true); // PCM
    header.setUint16(22, 1, true); // Mono
    header.setUint32(24, SAMPLE_RATE, true);
    header.setUint32(28, SAMPLE_RATE * 2, true);
    header.setUint16(32, 2, true);
    header.setUint16(34, 16, true);
    bytes.set(encoder.encode("data"), 36);
    header.setUint32(40, frames * 2, true);

    const channels = Array.from({ length: audio.numberOfChannels }, (_, index) => audio.getChannelData(index));
    for (let frame = 0; frame < frames; frame += 1) {
        let sum = 0;
        for (const channel of channels) sum += channel[frame];
        const sample = Math.max(-1, Math.min(1, sum / channels.length));
        header.setInt16(44 + frame * 2, sample < 0 ? sample * 32768 : sample * 32767, true);
    }

    return new Blob([samples], { type: "audio/wav" });
}

export default function VoiceInput({ targetRef, onValueChange, onBusyChange, disabled = false }: VoiceInputProps) {
    const [phase, setPhase] = useState<Phase>("idle");
    const [notice, setNotice] = useState("");
    const active = useRef<Recording | null>(null);
    const consentId = useId();

    useEffect(() => () => {
        const recording = active.current;
        if (!recording) return;
        active.current = null;
        dispose(recording);
        onBusyChange(false);
    }, [onBusyChange]);

    const reset = useCallback((message: string) => {
        const recording = active.current;
        active.current = null;
        if (recording) dispose(recording);
        setNotice(message);
        setPhase("idle");
        onBusyChange(false);
    }, [onBusyChange]);

    useEffect(() => {
        if (disabled && (active.current || phase === "consent")) reset("");
    }, [disabled, phase, reset]);

    async function transcribe(recording: Recording, audio: Blob) {
        releaseMicrophone(recording);
        if (!audio.size || !SUPPORTED_TYPES.has(audio.type.split(";")[0])) {
            reset("Не удалось получить запись. Попробуйте ещё раз или введите текст вручную.");
            return;
        }

        setPhase("transcribing");
        setNotice("Распознаём запись и готовим заявку.");
        const controller = new AbortController();
        recording.controller = controller;
        recording.timer = window.setTimeout(() => {
            if (active.current === recording) reset("Обработка записи заняла слишком много времени. Попробуйте ещё раз или введите текст вручную.");
        }, TRANSCRIPTION_TIMEOUT_MS);

        try {
            const source = await audio.arrayBuffer();
            if (active.current !== recording) return;
            const context = new OfflineAudioContext(1, 1, SAMPLE_RATE);
            const decoded = await context.decodeAudioData(source);
            if (active.current !== recording) return;
            const wav = encodeWave(decoded);

            const response = await fetch("/api/voice-transcription", {
                method: "POST",
                headers: { "Content-Type": wav.type, "X-Voice-Consent": "1" },
                body: wav,
                signal: controller.signal,
            });
            const result = await response.json().catch(() => null);
            if (active.current !== recording) return;

            const text = typeof result?.text === "string" ? result.text.trim() : "";
            if (!response.ok || result?.ok !== true || !text) {
                reset(typeof result?.message === "string" ? result.message : "Не удалось расшифровать запись. Попробуйте ещё раз.");
                return;
            }

            const field = targetRef.current;
            if (!field) {
                reset("");
                return;
            }
            const current = field.value;
            const separator = current.trim() && !/\s$/.test(current) ? "\n" : "";
            const available = field.maxLength < 0 ? text.length : field.maxLength - current.length - separator.length;
            const inserted = text.slice(0, Math.max(0, available)).replace(/[\uD800-\uDBFF]$/, "");
            const formatted = result.formatted === true;
            if (inserted) onValueChange(current + separator + inserted, formatted);
            if (!inserted) reset("Поле заполнено. Освободите место и попробуйте ещё раз.");
            else if (inserted.length !== text.length) reset("Добавили часть текста, которая поместилась в поле.");
            else reset(formatted ? "Черновик готов. Его можно отредактировать." : "Расшифровка добавлена. Её можно отредактировать.");
        } catch {
            if (active.current === recording) reset("Не удалось расшифровать запись. Попробуйте ещё раз или введите текст вручную.");
        }
    }

    async function start() {
        if (active.current) return;
        const recording: Recording = {};
        active.current = recording;
        setPhase("requesting");
        setNotice("Разрешите доступ к микрофону в браузере.");
        onBusyChange(true);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            recording.stream = stream;
            if (active.current !== recording) {
                releaseMicrophone(recording);
                return;
            }

            const mimeType = RECORDING_TYPES.find((type) => MediaRecorder.isTypeSupported(type));
            const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
            recording.recorder = recorder;
            const chunks: Blob[] = [];
            let size = 0;
            const startedAt = performance.now();
            recorder.ondataavailable = ({ data }) => {
                if (active.current !== recording) return;
                size += data.size;
                if (size > MAX_BYTES) {
                    reset("Запись получилась слишком большой. Попробуйте продиктовать задачу короче.");
                    return;
                }
                if (data.size) chunks.push(data);
                if (performance.now() - startedAt >= MAX_DURATION_MS && recorder.state === "recording") recorder.stop();
            };
            recorder.onerror = () => {
                if (active.current === recording) reset("Не удалось записать звук. Проверьте микрофон и попробуйте ещё раз.");
            };
            recorder.onstop = () => {
                if (active.current !== recording) return;
                const audio = new Blob(chunks, { type: chunks[0]?.type || recorder.mimeType });
                void transcribe(recording, audio);
            };
            recorder.start(500);
            recording.timer = window.setTimeout(() => {
                if (recorder.state === "recording") recorder.stop();
            }, MAX_DURATION_MS);
            setPhase("recording");
            setNotice("Запись идёт, до 90 секунд.");
        } catch (error) {
            if (active.current !== recording) return;
            const denied = error instanceof DOMException && error.name === "NotAllowedError";
            reset(denied ? "Доступ к микрофону не разрешён. Введите текст вручную или проверьте разрешения браузера."
                : "Микрофон недоступен. Введите текст вручную или проверьте подключение.");
        }
    }

    function activate() {
        if (phase === "recording") {
            if (active.current?.recorder?.state === "recording") active.current.recorder.stop();
            return;
        }
        if (phase === "consent") {
            void start();
            return;
        }
        if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined" || typeof OfflineAudioContext === "undefined") {
            setNotice("Запись недоступна в этом браузере. Введите текст вручную.");
            return;
        }
        setNotice("");
        setPhase("consent");
    }

    return (
        <div className="voice-input">
            {phase === "consent" && (
                <p className="voice-input__notice" id={consentId} role="status">
                    Polza AI обработает запись для расшифровки и подготовки текста заявки.
                </p>
            )}
            <div className="voice-input__controls">
                <button type="button" className="voice-input__button" disabled={disabled || phase === "requesting" || phase === "transcribing"}
                    aria-describedby={phase === "consent" ? consentId : undefined} onClick={activate}>
                    <i className={`fa-solid ${phase === "recording" ? "fa-stop" : "fa-microphone"}`} aria-hidden="true" />
                    {BUTTON_LABELS[phase]}
                </button>
                {phase !== "idle" && (
                    <button type="button" className="voice-input__button" onClick={() => reset("Запись отменена.")}>Отмена</button>
                )}
            </div>
            {notice && <p className="voice-input__notice" role="status">{notice}</p>}
        </div>
    );
}
