"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  Hand,
  Lamp,
  Mic,
  Shield,
  Speaker,
  SunMedium,
  Thermometer,
  Volume2,
} from "lucide-react";

const initialDevices = [
  { id: 1, name: "Living Room Lamp", type: "lamp", room: "Living Room", level: 70, online: true },
  { id: 2, name: "Corner Lamp", type: "lamp", room: "Living Room", level: 45, online: true },
  { id: 3, name: "Thermostat", type: "thermostat", room: "Hallway", level: 72, online: true },
  { id: 4, name: "Speaker", type: "speaker", room: "Living Room", level: 35, online: true },
];

function iconFor(type) {
  if (type === "lamp") return Lamp;
  if (type === "thermostat") return Thermometer;
  return Speaker;
}

function labelFor(type) {
  if (type === "lamp") return "Brightness";
  if (type === "thermostat") return "Temperature";
  return "Volume";
}

function Badge({ children }) {
  return <span className="badge">{children}</span>;
}

function SectionCard({ title, icon: Icon, children, className = "" }) {
  return (
    <section className={`card ${className}`.trim()}>
      <div className="cardHeader">
        <h2 className="cardTitle">
          {Icon ? <Icon size={20} /> : null}
          <span>{title}</span>
        </h2>
      </div>
      <div className="cardBody">{children}</div>
    </section>
  );
}

function ActionButton({ children, active = false, secondary = false, full = false, icon: Icon, ...props }) {
  const classNames = [
    "button",
    active ? "buttonPrimary" : secondary ? "buttonSecondary" : "buttonPrimary",
    full ? "buttonFull" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classNames} {...props}>
      {Icon ? <Icon size={16} /> : null}
      <span>{children}</span>
    </button>
  );
}

export default function DribbleSmartHomePrototype() {
  const [privacyArmed, setPrivacyArmed] = useState(false);
  const [devices, setDevices] = useState(initialDevices);
  const [stage, setStage] = useState("idle");
  const [pointedRoom, setPointedRoom] = useState("Living Room");
  const [voiceText, setVoiceText] = useState("dim");
  const [selectedIds, setSelectedIds] = useState([]);
  const [feedback, setFeedback] = useState("System idle. No continuous recording.");
  const [showCandidates, setShowCandidates] = useState(false);

  const candidates = useMemo(() => {
    if (pointedRoom === "Living Room") {
      return devices.filter((device) => device.room === "Living Room" && device.type === "lamp");
    }
    return devices.filter((device) => device.room === pointedRoom);
  }, [devices, pointedRoom]);

  const selectedDevice = devices.find((device) => device.id === selectedIds[0]);

  const armSensor = () => {
    setPrivacyArmed(true);
    setStage("armed");
    setFeedback("Sensor activated only after deliberate user action.");
    setSelectedIds([]);
    setShowCandidates(false);
  };

  const pointAtDevices = () => {
    if (!privacyArmed) return;

    setStage("targeting");

    if (candidates.length > 1) {
      setShowCandidates(true);
      setFeedback("Multiple possible devices detected. Please confirm one.");
      return;
    }

    if (candidates.length === 1) {
      setSelectedIds([candidates[0].id]);
      setShowCandidates(false);
      setFeedback(`Target locked: ${candidates[0].name}`);
      setStage("confirmed");
    }
  };

  const chooseCandidate = (id) => {
    const chosen = devices.find((device) => device.id === id);
    setSelectedIds([id]);
    setShowCandidates(false);
    setStage("confirmed");
    setFeedback(`Target confirmed: ${chosen?.name ?? "device"}`);
  };

  const applyCommand = (nextValue) => {
    if (!selectedDevice) return;

    setDevices((prev) =>
      prev.map((device) =>
        device.id === selectedDevice.id ? { ...device, level: Number(nextValue) } : device
      )
    );
    setStage("acting");

    window.clearTimeout(window.__smartHomeTimer);
    window.__smartHomeTimer = window.setTimeout(() => {
      setStage("done");
      setFeedback(`${selectedDevice.name} ${voiceText} applied successfully.`);
    }, 300);
  };

  const resetFlow = () => {
    setPrivacyArmed(false);
    setStage("idle");
    setSelectedIds([]);
    setFeedback("System idle. No continuous recording.");
    setShowCandidates(false);
  };

  return (
    <main className="pageShell">
      <div className="container">
        <header className="hero">
          <div>
            <p className="eyebrow">Dribble Prototype</p>
            <h1>Gesture + Voice Smart Home Control</h1>
            <p className="heroText">
              Interactive prototype showing privacy-first activation, device targeting,
              multimodal disambiguation, and real-time feedback.
            </p>
          </div>
          <div className="badgeRow">
            <Badge>Privacy-first</Badge>
            <Badge>Gesture + Voice</Badge>
            <Badge>Disambiguation</Badge>
          </div>
        </header>

        <div className="mainGrid">
          <SectionCard title="Smart Home Scene" icon={Eye} className="sceneCard">
            <div className="scenePanel">
              <div className="sceneGrid">
                <div className="controlColumn">
                  <div className="panelBlock">
                    <div className="panelHeaderRow">
                      <div>
                        <p className="muted">Hub Status</p>
                        <div className="statusRow">
                          <Shield
                            size={16}
                            className={privacyArmed ? "iconActive" : "iconMuted"}
                          />
                          <span>{privacyArmed ? "Sensor Active" : "Sensor Off"}</span>
                        </div>
                      </div>

                      <ActionButton onClick={privacyArmed ? resetFlow : armSensor}>
                        {privacyArmed ? "End Session" : "Raise Hand to Activate"}
                      </ActionButton>
                    </div>
                    <p className="helpText">
                      The system only listens after an intentional trigger gesture.
                    </p>
                  </div>

                  <div className="panelBlock">
                    <p className="muted sectionLabel">Point Toward</p>
                    <div className="buttonWrap">
                      {["Living Room", "Hallway"].map((room) => (
                        <ActionButton
                          key={room}
                          active={pointedRoom === room}
                          secondary={pointedRoom !== room}
                          onClick={() => setPointedRoom(room)}
                        >
                          {room}
                        </ActionButton>
                      ))}
                      <ActionButton onClick={pointAtDevices} disabled={!privacyArmed} icon={Hand}>
                        Point Now
                      </ActionButton>
                    </div>
                  </div>

                  <div className="panelBlock">
                    <p className="muted sectionLabel">Voice Qualifier</p>
                    <div className="buttonWrap">
                      {["dim", "raise", "set", "mute"].map((command) => (
                        <ActionButton
                          key={command}
                          active={voiceText === command}
                          secondary={voiceText !== command}
                          onClick={() => setVoiceText(command)}
                          icon={Mic}
                        >
                          {command}
                        </ActionButton>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="devicesGrid">
                  {devices.map((device) => {
                    const Icon = iconFor(device.type);
                    const isCandidate = candidates.some((candidate) => candidate.id === device.id) && showCandidates;
                    const isSelected = selectedIds.includes(device.id);

                    return (
                      <motion.div
                        key={device.id}
                        layout
                        className={`deviceTile ${
                          isSelected
                            ? "deviceTileSelected"
                            : isCandidate
                            ? "deviceTileCandidate"
                            : ""
                        }`}
                      >
                        <div className="deviceHeader">
                          <div>
                            <div className="deviceNameRow">
                              <Icon size={18} />
                              <p className="deviceName">{device.name}</p>
                            </div>
                            <p className="deviceRoom">{device.room}</p>
                          </div>
                          {isSelected ? <CheckCircle2 size={18} className="iconActive" /> : null}
                        </div>

                        <div className="deviceMeta">
                          <p className="deviceLabel">{labelFor(device.type)}</p>
                          <p className="deviceValue">
                            {device.level}
                            {device.type === "thermostat" ? "°" : "%"}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </SectionCard>

          <div className="sideColumn">
            <SectionCard title="System Feedback">
              <div className="stack">
                <div className="panelBlock compact">
                  <p className="muted">Current State</p>
                  <p className="stateValue">{stage}</p>
                </div>
                <div className="feedbackBox">
                  {stage === "targeting" || showCandidates ? (
                    <AlertCircle size={18} className="iconWarn" />
                  ) : (
                    <CheckCircle2 size={18} className="iconActive" />
                  )}
                  <p>{feedback}</p>
                </div>
              </div>
            </SectionCard>

            <AnimatePresence>
              {showCandidates ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
                  <SectionCard title="Disambiguation">
                    <div className="stack">
                      <p className="helpText">I found multiple matching devices. Which one did you mean?</p>
                      {candidates.map((device) => {
                        const Icon = iconFor(device.type);
                        return (
                          <ActionButton
                            key={device.id}
                            full
                            secondary
                            icon={Icon}
                            onClick={() => chooseCandidate(device.id)}
                          >
                            {device.name}
                          </ActionButton>
                        );
                      })}
                    </div>
                  </SectionCard>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <SectionCard title="Gesture Action">
              <div className="stack">
                <div className="panelBlock compact">
                  <p className="muted">Selected Device</p>
                  <p className="selectedValue">{selectedDevice ? selectedDevice.name : "None yet"}</p>
                  <p className="helpText">Use a pinch or slide style adjustment after target confirmation.</p>
                </div>

                <div className="panelBlock compact">
                  <div className="sliderHeader">
                    {selectedDevice?.type === "speaker" ? <Volume2 size={16} /> : <SunMedium size={16} />}
                    <p>Continuous control</p>
                  </div>
                  <input
                    type="range"
                    className="rangeInput"
                    value={selectedDevice?.level ?? 0}
                    min={selectedDevice?.type === "thermostat" ? 60 : 0}
                    max={selectedDevice?.type === "thermostat" ? 85 : 100}
                    step="1"
                    disabled={!selectedDevice}
                    onChange={(event) => applyCommand(event.target.value)}
                  />
                </div>
              </div>
            </SectionCard>
          </div>
        </div>

        <div className="requirementsGrid">
          {[
            { title: "R1", text: "Point to target devices naturally" },
            { title: "R2", text: "Continuous dimming and adjustment" },
            { title: "R3", text: "Immediate visual confirmation" },
            { title: "R4", text: "Only activated intentionally" },
            { title: "R5", text: "Prompt when devices are ambiguous" },
          ].map((item) => (
            <section key={item.title} className="requirementCard">
              <p className="requirementTitle">{item.title}</p>
              <p className="requirementText">{item.text}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
