"use client";

import { useId, type ReactNode } from "react";

export type TradeIllustrationVariant =
  | "bathroom"
  | "kitchen"
  | "extension"
  | "loft"
  | "roofing"
  | "driveway"
  | "flooring"
  | "plastering"
  | "builder"
  | "plumber"
  | "electrician"
  | "landscaper"
  | "heating";

export type BenefitIconVariant = "free" | "verified" | "fast" | "reviews" | "flexible" | "local";

type CharacterProps = {
  x: number;
  y: number;
  shirt: string;
  skin?: string;
  trousers?: string;
  helmet?: string;
  kneeling?: boolean;
  facing?: "left" | "right";
};

function Character({
  x,
  y,
  shirt,
  skin = "#2196F3",
  trousers = "#0D47A1",
  helmet,
  kneeling = false,
  facing = "right",
}: CharacterProps) {
  const direction = facing === "right" ? 1 : -1;

  return (
    <g transform={`translate(${x} ${y}) scale(${direction} 1)`}>
      <circle cx="0" cy="-35" r="13" fill={skin} />
      <path d="M-12-38c2-11 21-12 25 0v4H-12z" fill="#0D47A1" />
      {helmet && (
        <>
          <path d="M-15-39c1-13 28-13 30 0v4h-30z" fill={helmet} />
          <rect x="-18" y="-37" width="36" height="5" rx="2.5" fill={helmet} />
        </>
      )}
      <circle cx="5" cy="-34" r="1.5" fill="#0D47A1" />
      <path d="M5-28c3 1 5 0 6-2" stroke="#2196F3" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="-14" y="-19" width="28" height="39" rx="10" fill={shirt} />
      <path d="M-8-13L1 17M8-13L-1 17" stroke="rgba(255,255,255,.28)" strokeWidth="4" strokeLinecap="round" />
      <rect x="-10" y="15" width="20" height="8" rx="3" fill="#90CAF9" />
      {kneeling ? (
        <>
          <path d="M-7 21h14l18 15-7 8L0 33-16 43l-6-9z" fill={trousers} />
          <rect x="17" y="37" width="22" height="8" rx="4" fill="#0D47A1" />
          <rect x="-28" y="37" width="20" height="8" rx="4" fill="#0D47A1" />
        </>
      ) : (
        <>
          <rect x="-11" y="21" width="9" height="35" rx="4.5" fill={trousers} />
          <rect x="3" y="21" width="9" height="35" rx="4.5" fill={trousers} />
          <rect x="-16" y="51" width="16" height="7" rx="3.5" fill="#0D47A1" />
          <rect x="2" y="51" width="17" height="7" rx="3.5" fill="#0D47A1" />
        </>
      )}
    </g>
  );
}

function Arm({
  d,
  handX,
  handY,
  skin = "#2196F3",
  sleeve,
}: {
  d: string;
  handX: number;
  handY: number;
  skin?: string;
  sleeve: string;
}) {
  return (
    <>
      <path d={d} stroke={sleeve} strokeWidth="11" strokeLinecap="round" />
      <circle cx={handX} cy={handY} r="5" fill={skin} />
    </>
  );
}

const SCENE_BACKGROUNDS: Record<TradeIllustrationVariant, [string, string]> = {
  bathroom: ["#E3F2FD", "#E3F2FD"],
  kitchen: ["#E3F2FD", "#E3F2FD"],
  extension: ["#E3F2FD", "#E3F2FD"],
  loft: ["#E3F2FD", "#E3F2FD"],
  roofing: ["#E3F2FD", "#E3F2FD"],
  driveway: ["#E3F2FD", "#E3F2FD"],
  flooring: ["#E3F2FD", "#90CAF9"],
  plastering: ["#E3F2FD", "#E3F2FD"],
  builder: ["#E3F2FD", "#E3F2FD"],
  plumber: ["#E3F2FD", "#E3F2FD"],
  electrician: ["#E3F2FD", "#90CAF9"],
  landscaper: ["#E3F2FD", "#E3F2FD"],
  heating: ["#E3F2FD", "#E3F2FD"],
};

function BathroomScene() {
  return (
    <>
      <path d="M18 30h104v82H18z" fill="#E3F2FD" />
      {[0, 1, 2, 3].map((row) => <path key={row} d={`M18 ${50 + row * 20}h104`} stroke="#E3F2FD" />)}
      {[0, 1, 2, 3, 4].map((col) => <path key={col} d={`M${38 + col * 20} 30v82`} stroke="#E3F2FD" />)}
      <path d="M15 111h114l-8 28H23z" fill="white" stroke="#2196F3" strokeWidth="3" />
      <path d="M31 111V78c0-12 20-12 20 0" fill="none" stroke="#2196F3" strokeWidth="4" strokeLinecap="round" />
      <path d="M50 79h15" stroke="#2196F3" strokeWidth="4" strokeLinecap="round" />
      <Character x={181} y={91} shirt="#2196F3" helmet="#90CAF9" kneeling facing="left" />
      <Arm d="M168 74 143 91" handX={143} handY={91} sleeve="#2196F3" />
      <path d="M137 85l14 13" stroke="#0D47A1" strokeWidth="4" strokeLinecap="round" />
      <path d="M132 80l8 8" stroke="#000000" strokeWidth="7" strokeLinecap="round" />
      <circle cx="227" cy="45" r="18" fill="#2196F3" opacity=".12" />
      <path d="M220 45h14M227 38v14" stroke="#2196F3" strokeWidth="3" strokeLinecap="round" />
    </>
  );
}

function KitchenScene() {
  return (
    <>
      <rect x="19" y="48" width="91" height="72" rx="5" fill="#E3F2FD" stroke="#90CAF9" strokeWidth="2" />
      <path d="M19 73h91M62 73v47" stroke="#90CAF9" strokeWidth="2" />
      <circle cx="54" cy="95" r="2" fill="#2196F3" /><circle cx="70" cy="95" r="2" fill="#2196F3" />
      <rect x="14" y="39" width="104" height="12" rx="4" fill="#0D47A1" />
      <rect x="28" y="25" width="35" height="12" rx="3" fill="#90CAF9" opacity=".35" />
      <Character x={176} y={92} shirt="#2196F3" skin="#2196F3" helmet="#90CAF9" />
      <Arm d="M164 75 137 58" handX={137} handY={58} sleeve="#2196F3" skin="#2196F3" />
      <Arm d="M187 75 148 60" handX={148} handY={60} sleeve="#2196F3" skin="#2196F3" />
      <rect x="135" y="54" width="21" height="13" rx="3" fill="#2196F3" />
      <path d="M141 51h9" stroke="#0D47A1" strokeWidth="4" strokeLinecap="round" />
      <path d="M229 32v83" stroke="#90CAF9" strokeWidth="4" />
      <path d="M207 54h42M207 77h42" stroke="#90CAF9" strokeWidth="2" />
    </>
  );
}

function ExtensionScene() {
  return (
    <>
      <path d="M18 52h112v72H18z" fill="#E3F2FD" stroke="#2196F3" strokeWidth="2" />
      <path d="M10 54l64-43 65 43" fill="#2196F3" />
      <rect x="41" y="74" width="33" height="50" fill="#E3F2FD" stroke="#2196F3" strokeWidth="2" />
      <path d="M129 75h44v49h-44z" fill="#90CAF9" />
      {[0, 1, 2].map((row) => <path key={row} d={`M129 ${88 + row * 12}h44`} stroke="#2196F3" />)}
      <path d="M151 75v49" stroke="#2196F3" />
      <Character x={205} y={92} shirt="#2196F3" skin="#2196F3" helmet="#90CAF9" />
      <Arm d="M193 73 164 63" handX={164} handY={63} sleeve="#2196F3" skin="#2196F3" />
      <Arm d="M216 73 180 63" handX={180} handY={63} sleeve="#2196F3" skin="#2196F3" />
      <rect x="160" y="53" width="27" height="20" rx="2" fill="white" stroke="#2196F3" strokeWidth="2" />
      <path d="M164 59h18M164 64h13" stroke="#90CAF9" strokeWidth="1.5" />
      <rect x="115" y="119" width="128" height="8" rx="4" fill="#90CAF9" />
    </>
  );
}

function LoftScene() {
  return (
    <>
      <path d="M16 119L72 25l57 94M101 119l55-76 87 76" fill="#E3F2FD" stroke="#2196F3" strokeWidth="5" strokeLinejoin="round" />
      <path d="M29 119h205" stroke="#2196F3" strokeWidth="6" strokeLinecap="round" />
      <path d="M72 25v94M156 43v76" stroke="#90CAF9" strokeWidth="3" />
      <rect x="87" y="60" width="39" height="35" rx="3" fill="#E3F2FD" stroke="#2196F3" strokeWidth="2" transform="rotate(-7 106 78)" />
      <Character x={186} y={88} shirt="#2196F3" helmet="#90CAF9" kneeling facing="left" />
      <Arm d="M173 70 148 88" handX={148} handY={88} sleeve="#2196F3" />
      <path d="M144 86l22 2" stroke="#90CAF9" strokeWidth="4" strokeLinecap="round" />
      <circle cx="143" cy="87" r="5" fill="#0D47A1" />
      <path d="M35 112h47" stroke="#2196F3" strokeWidth="7" strokeLinecap="round" />
    </>
  );
}

function RoofingScene() {
  return (
    <>
      <path d="M8 125L91 36l82 89z" fill="#E3F2FD" stroke="#2196F3" strokeWidth="4" strokeLinejoin="round" />
      {[0, 1, 2, 3].map((row) => <path key={row} d={`M${26 + row * 15} ${112 - row * 16}h${130 - row * 30}`} stroke="#90CAF9" strokeWidth="2" />)}
      <path d="M174 125l30-59 48 59" fill="#E3F2FD" stroke="#2196F3" strokeWidth="4" />
      <Character x={154} y={75} shirt="#2196F3" skin="#2196F3" helmet="#90CAF9" kneeling facing="left" />
      <Arm d="M141 58 117 72" handX={117} handY={72} sleeve="#2196F3" skin="#2196F3" />
      <path d="M111 63l14 17M108 64l14-9" stroke="#0D47A1" strokeWidth="4" strokeLinecap="round" />
      <rect x="191" y="105" width="45" height="20" rx="4" fill="#2196F3" />
      <path d="M201 105v-7h24v7" fill="none" stroke="#0D47A1" strokeWidth="4" />
    </>
  );
}

function DrivewayScene() {
  return (
    <>
      <path d="M4 105l252-25v80H4z" fill="#90CAF9" />
      {[0, 1, 2, 3, 4].map((row) => <path key={row} d={`M${20 + row * 48} 111l35-4 16 14-37 5z`} fill={row % 2 ? "#000000" : "#000000"} />)}
      <path d="M18 92h87" stroke="#000000" strokeWidth="7" strokeLinecap="round" />
      <Character x={181} y={83} shirt="#2196F3" skin="#2196F3" helmet="#90CAF9" />
      <Arm d="M169 65 148 88" handX={148} handY={88} sleeve="#2196F3" skin="#2196F3" />
      <Arm d="M192 65 161 89" handX={161} handY={89} sleeve="#2196F3" skin="#2196F3" />
      <path d="M149 86l22 32" stroke="#0D47A1" strokeWidth="4" />
      <rect x="149" y="113" width="42" height="15" rx="4" fill="#2196F3" />
      <circle cx="158" cy="131" r="6" fill="#0D47A1" /><circle cx="182" cy="131" r="6" fill="#0D47A1" />
      <path d="M12 44h66v40H12z" fill="#E3F2FD" stroke="#2196F3" strokeWidth="2" />
      <path d="M12 44l33-24 33 24" fill="#2196F3" />
    </>
  );
}

function FlooringScene() {
  return (
    <>
      <path d="M0 91h260v69H0z" fill="#90CAF9" />
      {[0, 1, 2, 3].map((row) => <path key={row} d={`M0 ${103 + row * 15}h260`} stroke="#2196F3" strokeWidth="2" />)}
      <path d="M52 91l23 69M113 91l23 69M178 91l23 69M230 91l16 69" stroke="#2196F3" strokeWidth="2" />
      <Character x={166} y={81} shirt="#2196F3" skin="#2196F3" kneeling facing="left" />
      <Arm d="M154 64 119 93" handX={119} handY={93} sleeve="#2196F3" skin="#2196F3" />
      <Arm d="M177 64 143 95" handX={143} handY={95} sleeve="#2196F3" skin="#2196F3" />
      <path d="M97 96l55-10 7 11-56 11z" fill="#2196F3" stroke="#0D47A1" strokeWidth="2" />
      <rect x="22" y="52" width="62" height="31" rx="3" fill="#E3F2FD" stroke="#90CAF9" strokeWidth="2" />
      <path d="M32 62h40M32 71h28" stroke="#90CAF9" strokeWidth="2" />
    </>
  );
}

function PlasteringScene() {
  return (
    <>
      <rect x="12" y="20" width="132" height="111" rx="5" fill="#E3F2FD" stroke="#90CAF9" strokeWidth="2" />
      <path d="M24 32h73v88H24z" fill="#E3F2FD" />
      <path d="M96 32c13 16 9 37 0 50s5 28 0 38" stroke="#90CAF9" strokeWidth="3" fill="none" />
      <Character x={193} y={91} shirt="#0D47A1" skin="#2196F3" />
      <Arm d="M181 72 143 59" handX={143} handY={59} sleeve="#0D47A1" skin="#2196F3" />
      <Arm d="M204 72 160 86" handX={160} handY={86} sleeve="#0D47A1" skin="#2196F3" />
      <path d="M134 52l22 8-4 10-22-8z" fill="#90CAF9" stroke="#000000" strokeWidth="2" />
      <path d="M147 68l12 19" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
      <rect x="162" y="82" width="39" height="6" rx="3" fill="#000000" />
      <path d="M18 132h220" stroke="#000000" strokeWidth="5" strokeLinecap="round" />
    </>
  );
}

function BuilderScene() {
  return (
    <>
      <path d="M14 132h118V62H14z" fill="#90CAF9" />
      {[0, 1, 2, 3].map((row) => <path key={row} d={`M14 ${76 + row * 14}h118`} stroke="#2196F3" strokeWidth="2" />)}
      {[0, 1, 2, 3].map((col) => <path key={col} d={`M${35 + col * 28} 62v70`} stroke="#2196F3" strokeWidth="2" />)}
      <Character x={183} y={91} shirt="#2196F3" skin="#2196F3" helmet="#90CAF9" />
      <Arm d="M171 72 143 68" handX={143} handY={68} sleeve="#2196F3" skin="#2196F3" />
      <Arm d="M194 72 157 79" handX={157} handY={79} sleeve="#2196F3" skin="#2196F3" />
      <rect x="139" y="62" width="9" height="56" rx="4" fill="#2196F3" />
      <circle cx="143.5" cy="69" r="2" fill="#E3F2FD" />
      <circle cx="143.5" cy="90" r="2" fill="#E3F2FD" />
      <path d="M225 132V44h22" stroke="#000000" strokeWidth="5" />
      <path d="M218 54h35M218 78h35" stroke="#000000" strokeWidth="4" />
    </>
  );
}

function PlumberScene() {
  return (
    <>
      <path d="M17 32h91v54H17z" fill="#E3F2FD" stroke="#90CAF9" strokeWidth="2" />
      <path d="M61 86v22c0 14 17 14 17 0V94h28" fill="none" stroke="#2196F3" strokeWidth="7" strokeLinecap="round" />
      <path d="M42 45h42v10H42z" fill="#E3F2FD" />
      <path d="M63 45V31h17" fill="none" stroke="#2196F3" strokeWidth="4" strokeLinecap="round" />
      <Character x={179} y={91} shirt="#2196F3" skin="#2196F3" kneeling facing="left" />
      <Arm d="M166 74 130 100" handX={130} handY={100} sleeve="#2196F3" skin="#2196F3" />
      <path d="M123 94c10-7 18 4 10 12l-14 14c-4 4-10-2-6-6l14-14" fill="#000000" />
      <path d="M12 133h230" stroke="#90CAF9" strokeWidth="5" strokeLinecap="round" />
      <path d="M110 46c9 9 9 19 0 27-9-8-9-18 0-27z" fill="#2196F3" />
    </>
  );
}

function ElectricianScene() {
  return (
    <>
      <rect x="16" y="31" width="88" height="88" rx="5" fill="#E3F2FD" stroke="#2196F3" strokeWidth="2" />
      <rect x="31" y="47" width="58" height="49" rx="4" fill="#E3F2FD" stroke="#000000" strokeWidth="2" />
      {[0, 1, 2].map((row) => <g key={row}><rect x="39" y={55 + row * 12} width="15" height="7" rx="2" fill="#2196F3" /><rect x="64" y={55 + row * 12} width="15" height="7" rx="2" fill="#2196F3" /></g>)}
      <Character x={176} y={92} shirt="#2196F3" skin="#2196F3" helmet="#90CAF9" />
      <Arm d="M164 73 121 66" handX={121} handY={66} sleeve="#2196F3" />
      <Arm d="M187 73 143 83" handX={143} handY={83} sleeve="#2196F3" />
      <path d="M115 59h14v15h-14z" fill="#90CAF9" stroke="#0D47A1" strokeWidth="2" />
      <path d="M122 74v16" stroke="#0D47A1" strokeWidth="3" />
      <path d="M222 31l-8 17h10l-8 19 24-25h-12l7-11z" fill="#90CAF9" />
      <path d="M10 133h235" stroke="#2196F3" strokeWidth="5" strokeLinecap="round" />
    </>
  );
}

function LandscaperScene() {
  return (
    <>
      <path d="M0 111c45-21 76 13 119-5 49-21 72-2 141-17v71H0z" fill="#90CAF9" />
      <path d="M14 112c7-42 48-59 84-34 18 12 13 35 13 35z" fill="#2196F3" />
      <circle cx="34" cy="70" r="18" fill="#2196F3" /><circle cx="69" cy="58" r="23" fill="#2196F3" /><circle cx="94" cy="79" r="19" fill="#2196F3" />
      <Character x={176} y={89} shirt="#2196F3" skin="#2196F3" helmet="#90CAF9" />
      <Arm d="M164 71 134 78" handX={134} handY={78} sleeve="#2196F3" skin="#2196F3" />
      <Arm d="M187 71 148 84" handX={148} handY={84} sleeve="#2196F3" skin="#2196F3" />
      <path d="M129 74l34 19M126 78l8-9M127 76l-7 10M160 91l8-9M161 91l-2 12" stroke="#2196F3" strokeWidth="3" strokeLinecap="round" />
      <path d="M224 117v-32M210 101c18 0 24-12 24-25-18 0-24 12-24 25zM239 107c-13 0-18-9-18-19 13 0 18 9 18 19z" fill="#2196F3" stroke="#2196F3" strokeWidth="2" />
    </>
  );
}

function HeatingScene() {
  return (
    <>
      <rect x="17" y="31" width="91" height="86" rx="7" fill="#E3F2FD" stroke="#90CAF9" strokeWidth="2" />
      <circle cx="62" cy="61" r="17" fill="#E3F2FD" stroke="#000000" strokeWidth="2" />
      <path d="M62 61l8-7" stroke="#2196F3" strokeWidth="3" strokeLinecap="round" />
      <rect x="33" y="91" width="58" height="9" rx="4.5" fill="#E3F2FD" />
      <path d="M38 117v17M87 117v17" stroke="#000000" strokeWidth="5" />
      <Character x={179} y={92} shirt="#2196F3" skin="#2196F3" />
      <Arm d="M166 73 126 73" handX={126} handY={73} sleeve="#2196F3" skin="#2196F3" />
      <Arm d="M190 73 145 93" handX={145} handY={93} sleeve="#2196F3" skin="#2196F3" />
      <rect x="119" y="64" width="15" height="19" rx="3" fill="#2196F3" stroke="#0D47A1" strokeWidth="2" />
      <path d="M126 83v17" stroke="#0D47A1" strokeWidth="3" />
      <path d="M218 52c-9 12-4 23 6 28 11-9 12-22 1-34 0 9-5 11-7 6z" fill="#2196F3" />
      <path d="M222 61c-4 7-1 12 4 15 5-5 5-11 1-17-1 4-3 4-5 2z" fill="#90CAF9" />
    </>
  );
}

const SCENES: Record<TradeIllustrationVariant, () => ReactNode> = {
  bathroom: BathroomScene,
  kitchen: KitchenScene,
  extension: ExtensionScene,
  loft: LoftScene,
  roofing: RoofingScene,
  driveway: DrivewayScene,
  flooring: FlooringScene,
  plastering: PlasteringScene,
  builder: BuilderScene,
  plumber: PlumberScene,
  electrician: ElectricianScene,
  landscaper: LandscaperScene,
  heating: HeatingScene,
};

export function TradeIllustration({ variant, className = "" }: { variant: TradeIllustrationVariant; className?: string }) {
  const rawId = useId();
  const gradientId = `trade-gradient-${rawId.replace(/:/g, "")}`;
  const [start, end] = SCENE_BACKGROUNDS[variant];
  const Scene = SCENES[variant];

  return (
    <svg
      viewBox="0 0 260 160"
      className={className}
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={start} />
          <stop offset="1" stopColor={end} />
        </linearGradient>
      </defs>
      <rect width="260" height="160" fill={`url(#${gradientId})`} />
      <circle cx="221" cy="20" r="54" fill="white" opacity=".32" />
      <circle cx="24" cy="151" r="70" fill="white" opacity=".18" />
      <Scene />
    </svg>
  );
}

const BENEFIT_PATHS: Record<BenefitIconVariant, ReactNode> = {
  free: <><path d="M22 12v24M14 18h14a6 6 0 010 12H16a6 6 0 000 12h15" /><path d="M9 9l6 6M15 9l-6 6" /></>,
  verified: <><path d="M24 7l14 6v10c0 10-6 17-14 21-8-4-14-11-14-21V13z" /><path d="M17 25l5 5 10-12" /></>,
  fast: <><path d="M25 9a16 16 0 1016 16" /><path d="M25 17v9l7 4M34 7l7 1-1 7" /></>,
  reviews: <><path d="M10 12h28v20H22l-8 7v-7h-4z" /><path d="M24 16l2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8z" /></>,
  flexible: <><path d="M14 18h21M29 12l6 6-6 6M34 34H13M19 28l-6 6 6 6" /></>,
  local: <><path d="M24 44s13-12 13-24a13 13 0 10-26 0c0 12 13 24 13 24z" /><circle cx="24" cy="20" r="4" /></>,
};

export function BenefitIcon({ variant }: { variant: BenefitIconVariant }) {
  return (
    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E3F2FD] to-white text-[#0D47A1] shadow-[inset_0_0_0_1px_rgba(13,71,161,0.12),0_5px_14px_rgba(13,71,161,0.10)]">
      <svg viewBox="0 0 48 48" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        {BENEFIT_PATHS[variant]}
      </svg>
    </span>
  );
}
