import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Hand, Shield, Lamp, Thermometer, Speaker, CheckCircle2, AlertCircle, Eye, Power, Volume2, SunMedium } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

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

export default function DribbleSmartHomePrototype() {
  const [privacyArmed, setPrivacyArmed] = useState(false);
  const [devices, setDevices] = useState(initialDevices);
  const [stage, setStage] = useState("idle");
  const [pointedRoom, setPointedRoom] = useState("Living Room");
  const [voiceText, setVoiceText] = useState("dim");
  const [selectedIds, setSelectedIds] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [showCandidates, setShowCandidates] = useState(false);

  const candidates = useMemo(() => {
    if (pointedRoom === "Living Room") {
      return devices.filter((d) => d.room === "Living Room" && d.type === "lamp");
    }
    return devices.filter((d) => d.room === pointedRoom);
  }, [devices, pointedRoom]);

  const selectedDevice = devices.find((d) => d.id === selectedIds[0]);

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
    } else if (candidates.length === 1) {
      setSelectedIds([candidates[0].id]);
      setShowCandidates(false);
      setFeedback(`Target locked: ${candidates[0].name}`);
      setStage("confirmed");
    }
  };

  const chooseCandidate = (id) => {
    setSelectedIds([id]);
    setShowCandidates(false);
    setStage("confirmed");
    const chosen = devices.find((d) => d.id === id);
    setFeedback(`Target confirmed: ${chosen?.name}`);
  };

  const applyCommand = (nextValue) => {
    if (!selectedDevice) return;
    setDevices((prev) =>
      prev.map((d) => (d.id === selectedDevice.id ? { ...d, level: nextValue } : d))
    );
    setStage("acting");
    setTimeout(() => {
      setStage("done");
      setFeedback(`${selectedDevice.name} ${voiceText} applied successfully.`);
    }, 400);
  };

  const resetFlow = () => {
    setPrivacyArmed(false);
    setStage("idle");
    setSelectedIds([]);
    setFeedback("System idle. No continuous recording.");
    setShowCandidates(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sky-400 text-sm font-semibold tracking-[0.25em] uppercase">Dribble Prototype</p>
            <h1 className="text-4xl font-bold mt-2">Gesture + Voice Smart Home Control</h1>
            <p className="text-slate-300 mt-2 max-w-3xl">
              Interactive prototype showing privacy-first activation, device targeting, multimodal disambiguation, and real-time feedback.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge className="bg-slate-800 text-slate-100 border border-slate-700 px-3 py-2">Privacy-first</Badge>
            <Badge className="bg-slate-800 text-slate-100 border border-slate-700 px-3 py-2">Gesture + Voice</Badge>
            <Badge className="bg-slate-800 text-slate-100 border border-slate-700 px-3 py-2">Disambiguation</Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-slate-900 border-slate-800 rounded-2xl shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Eye className="w-5 h-5" /> Smart Home Scene
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800 p-6 min-h-[420px] relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.35),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(168,85,247,0.25),_transparent_25%)]" />

                <div className="relative z-10 grid md:grid-cols-2 gap-6 h-full">
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-400">Hub Status</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Shield className={`w-4 h-4 ${privacyArmed ? "text-emerald-400" : "text-slate-500"}`} />
                            <span className="font-medium">{privacyArmed ? "Sensor Active" : "Sensor Off"}</span>
                          </div>
                        </div>
                        <Button onClick={privacyArmed ? resetFlow : armSensor} className="rounded-xl">
                          {privacyArmed ? "End Session" : "Raise Hand to Activate"}
                        </Button>
                      </div>
                      <p className="text-sm text-slate-400 mt-3">The system only listens after an intentional trigger gesture.</p>
                    </div>

                    <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
                      <p className="text-sm text-slate-400 mb-3">Point Toward</p>
                      <div className="flex gap-2 flex-wrap">
                        {["Living Room", "Hallway"].map((room) => (
                          <Button
                            key={room}
                            variant={pointedRoom === room ? "default" : "secondary"}
                            className="rounded-xl"
                            onClick={() => setPointedRoom(room)}
                          >
                            {room}
                          </Button>
                        ))}
                        <Button onClick={pointAtDevices} disabled={!privacyArmed} className="rounded-xl">
                          <Hand className="w-4 h-4 mr-2" /> Point Now
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
                      <p className="text-sm text-slate-400 mb-3">Voice Qualifier</p>
                      <div className="flex gap-2 flex-wrap">
                        {["dim", "raise", "set", "mute"].map((cmd) => (
                          <Button
                            key={cmd}
                            variant={voiceText === cmd ? "default" : "secondary"}
                            className="rounded-xl"
                            onClick={() => setVoiceText(cmd)}
                          >
                            <Mic className="w-4 h-4 mr-2" /> {cmd}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {devices.map((device) => {
                        const Icon = iconFor(device.type);
                        const isCandidate = candidates.some((c) => c.id === device.id) && showCandidates;
                        const isSelected = selectedIds.includes(device.id);
                        return (
                          <motion.div
                            key={device.id}
                            layout
                            className={`rounded-2xl border p-4 min-h-[120px] ${
                              isSelected
                                ? "border-emerald-400 bg-emerald-500/10"
                                : isCandidate
                                ? "border-amber-400 bg-amber-500/10"
                                : "border-slate-700 bg-slate-950/60"
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <Icon className="w-5 h-5" />
                                  <p className="font-semibold text-sm">{device.name}</p>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">{device.room}</p>
                              </div>
                              {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                            </div>
                            <div className="mt-5">
                              <p className="text-xs text-slate-400">{labelFor(device.type)}</p>
                              <p className="text-2xl font-bold mt-1">{device.level}{device.type === "thermostat" ? "°" : "%"}</p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="bg-slate-900 border-slate-800 rounded-2xl shadow-2xl">
              <CardHeader>
                <CardTitle className="text-xl">System Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <p className="text-sm text-slate-400">Current State</p>
                  <p className="text-lg font-semibold capitalize mt-1">{stage}</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 flex gap-3">
                  {stage === "targeting" || showCandidates ? (
                    <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />
                  )}
                  <p className="text-sm text-slate-200">{feedback || "Awaiting user action."}</p>
                </div>
              </CardContent>
            </Card>

            <AnimatePresence>
              {showCandidates && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}>
                  <Card className="bg-slate-900 border-slate-800 rounded-2xl shadow-2xl">
                    <CardHeader>
                      <CardTitle className="text-xl">Disambiguation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-slate-300">I found multiple matching devices. Which one did you mean?</p>
                      {candidates.map((device) => {
                        const Icon = iconFor(device.type);
                        return (
                          <Button key={device.id} variant="secondary" className="w-full justify-start rounded-xl" onClick={() => chooseCandidate(device.id)}>
                            <Icon className="w-4 h-4 mr-2" /> {device.name}
                          </Button>
                        );
                      })}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <Card className="bg-slate-900 border-slate-800 rounded-2xl shadow-2xl">
              <CardHeader>
                <CardTitle className="text-xl">Gesture Action</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <p className="text-sm text-slate-400">Selected Device</p>
                  <p className="font-semibold mt-1">{selectedDevice ? selectedDevice.name : "None yet"}</p>
                  <p className="text-xs text-slate-400 mt-1">Use a pinch/slide style adjustment after target confirmation.</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex items-center gap-2 mb-4">
                    {selectedDevice?.type === "speaker" ? <Volume2 className="w-4 h-4" /> : <SunMedium className="w-4 h-4" />}
                    <p className="text-sm text-slate-300">Continuous control</p>
                  </div>
                  <Slider
                    value={[selectedDevice?.level ?? 0]}
                    max={selectedDevice?.type === "thermostat" ? 85 : 100}
                    min={selectedDevice?.type === "thermostat" ? 60 : 0}
                    step={1}
                    disabled={!selectedDevice}
                    onValueChange={(val) => applyCommand(val[0])}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-4">
          {[
            { title: "R1", text: "Point to target devices naturally" },
            { title: "R2", text: "Continuous dimming and adjustment" },
            { title: "R3", text: "Immediate visual confirmation" },
            { title: "R4", text: "Only activated intentionally" },
            { title: "R5", text: "Prompt when devices are ambiguous" },
          ].map((item) => (
            <Card key={item.title} className="bg-slate-900 border-slate-800 rounded-2xl">
              <CardContent className="p-4">
                <p className="text-sky-400 font-bold text-sm">{item.title}</p>
                <p className="text-sm text-slate-300 mt-2">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
