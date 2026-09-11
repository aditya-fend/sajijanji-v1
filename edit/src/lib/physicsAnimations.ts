import gsap from "gsap";
import type { AnimationName } from "@/store/useEditorStore";

export interface AnimationOptionItem {
  value: AnimationName;
  label: string;
  category?: string;
  physicsTheory?: string;
}

export const MOUNT_ANIMATION_OPTIONS: AnimationOptionItem[] = [
  { value: "none", label: "Tanpa Animasi (Static)", category: "Basic" },
  {
    value: "spring-pop",
    label: "🌸 Spring Pop (Pegas & Damping)",
    category: "Fisika Pegas",
    physicsTheory: "Osilasi pegas elastis dengan overshoot redaman Hooke",
  },
  {
    value: "bounce-drop",
    label: "⚡ Bounce Drop (Gravitasi & Pantulan)",
    category: "Fisika Gravitasi",
    physicsTheory: "Akselerasi jatuh bebas gravitasi dengan koefisien restitusi elastis",
  },
  {
    value: "pendulum-swing",
    label: "🕰️ Pendulum Swing (Ayunan Bandul)",
    category: "Fisika Osilasi",
    physicsTheory: "Gerak harmonik sederhana pendulum dengan redaman gesekan udara",
  },
  {
    value: "magnetic-pull",
    label: "🧲 Magnetic Snap (Tarikan Magnetik)",
    category: "Fisika Elektromagnetik",
    physicsTheory: "Tarikan medan magnetik eksponensial dengan benturan mikro-elastis",
  },
  {
    value: "zoom-blur",
    label: "🚀 Depth Zoom Blur (Efek Kecepatan)",
    category: "Fisika Optik",
    physicsTheory: "Perubahan kedalaman akselerasi tinggi dengan motion blur dinamis",
  },
  {
    value: "float-rise",
    label: "🎈 Buoyant Float (Daya Apung)",
    category: "Fisika Fluida",
    physicsTheory: "Gaya apung Archimedes fluida dengan redaman laminar lembut",
  },
  {
    value: "fade-up",
    label: "⬆️ Kinetic Rise (Naik Halus)",
    category: "Fisika Kinetik",
    physicsTheory: "Impuls kinetik vertikal ke atas dengan deselerasi aerodinamis",
  },
  {
    value: "fade-down",
    label: "⬇️ Kinetic Drop (Turun Halus)",
    category: "Fisika Kinetik",
    physicsTheory: "Impuls kinetik vertikal ke bawah dengan deselerasi aerodinamis",
  },
  {
    value: "fade-left",
    label: "⬅️ Inertia Slide Kiri",
    category: "Fisika Kinetik",
    physicsTheory: "Inersia geser lateral dari kanan dengan redaman viskositas",
  },
  {
    value: "fade-right",
    label: "➡️ Inertia Slide Kanan",
    category: "Fisika Kinetik",
    physicsTheory: "Inersia geser lateral dari kiri dengan redaman viskositas",
  },
  {
    value: "fade-in",
    label: "✨ Optical Focus (Fokus Lensa)",
    category: "Fisika Optik",
    physicsTheory: "Transisi kedalaman fokus optik kamera dari blur ke tajam",
  },
];

export const UNMOUNT_ANIMATION_OPTIONS: AnimationOptionItem[] = [
  { value: "none", label: "Tanpa Animasi (Langsung Hilang)", category: "Basic" },
  {
    value: "spring-collapse",
    label: "🪤 Spring Collapse (Penciutan Pegas)",
    category: "Fisika Pegas",
    physicsTheory: "Gaya tarik pegas ke titik pusat dengan kontraksi elastis cepat",
  },
  {
    value: "drop-fade",
    label: "🍂 Free Fall Drop (Jatuh Bebas)",
    category: "Fisika Gravitasi",
    physicsTheory: "Jatuh bebas gravitasi bumi g·t² dengan disipasi partikel blur",
  },
  {
    value: "pendulum-exit",
    label: "💨 Centrifugal Swing (Lepas Sentrifugal)",
    category: "Fisika Osilasi",
    physicsTheory: "Pelepasan gaya sentrifugal rotasi bandul ke luar viewport",
  },
  {
    value: "zoom-out-warp",
    label: "🌌 Warp Depth Out (Tersedot Kedalam)",
    category: "Fisika Optik",
    physicsTheory: "Akselerasi kedalaman hiperbolik menjauhi kamera",
  },
  {
    value: "fade-up",
    label: "🚀 Kinetic Launch Up (Meluncur ke Atas)",
    category: "Fisika Kinetik",
    physicsTheory: "Akselerasi impuls dorong ke atas menembus batas atas",
  },
  {
    value: "fade-down",
    label: "⬇️ Kinetic Sink Down (Tenggelam ke Bawah)",
    category: "Fisika Kinetik",
    physicsTheory: "Akselerasi impuls jatuh ke bawah menembus batas bawah",
  },
  {
    value: "fade-left",
    label: "⬅️ Kinetic Throw Kiri",
    category: "Fisika Kinetik",
    physicsTheory: "Lemparan inersia kinetik terlepas ke arah kiri",
  },
  {
    value: "fade-right",
    label: "➡️ Kinetic Throw Kanan",
    category: "Fisika Kinetik",
    physicsTheory: "Lemparan inersia kinetik terlepas ke arah kanan",
  },
  {
    value: "fade-out",
    label: "🌫️ Optical Defocus (Defokus Blur)",
    category: "Fisika Optik",
    physicsTheory: "Defokus lensa kamera menjadi blur halus dan memudar",
  },
];

/**
 * Mengatur kondisi awal elemen (opacity: 0, scale, blur, offset) sebelum masuk viewport
 */
export function setInitialPreMountState(
  target: HTMLElement,
  animationName: AnimationName,
) {
  gsap.killTweensOf(target);

  if (animationName === "none") {
    gsap.set(target, {
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      skewX: 0,
      opacity: 1,
      filter: "blur(0px)",
      transformOrigin: "50% 50%",
      force3D: true,
    });
    return;
  }

  switch (animationName) {
    case "spring-pop":
      gsap.set(target, {
        scale: 0.15,
        y: 28,
        opacity: 0,
        filter: "blur(22px)",
        transformOrigin: "50% 50%",
        force3D: true,
      });
      break;
    case "bounce-drop":
      gsap.set(target, {
        y: -150,
        scale: 0.88,
        opacity: 0,
        filter: "blur(18px)",
        force3D: true,
      });
      break;
    case "pendulum-swing":
      gsap.set(target, {
        transformOrigin: "50% -20%",
        rotation: -34,
        x: -40,
        y: -30,
        opacity: 0,
        filter: "blur(14px)",
        force3D: true,
      });
      break;
    case "magnetic-pull":
      gsap.set(target, {
        x: -95,
        scale: 0.65,
        opacity: 0,
        filter: "blur(24px)",
        force3D: true,
      });
      break;
    case "zoom-blur":
      gsap.set(target, {
        scale: 1.65,
        opacity: 0,
        filter: "blur(28px)",
        force3D: true,
      });
      break;
    case "float-rise":
      gsap.set(target, {
        y: 95,
        scale: 0.95,
        opacity: 0,
        filter: "blur(14px)",
        force3D: true,
      });
      break;
    case "fade-up":
      gsap.set(target, {
        y: 64,
        scale: 0.94,
        opacity: 0,
        filter: "blur(16px)",
        force3D: true,
      });
      break;
    case "fade-down":
      gsap.set(target, {
        y: -64,
        scale: 0.94,
        opacity: 0,
        filter: "blur(16px)",
        force3D: true,
      });
      break;
    case "fade-left":
      gsap.set(target, {
        x: 75,
        opacity: 0,
        filter: "blur(18px)",
        force3D: true,
      });
      break;
    case "fade-right":
      gsap.set(target, {
        x: -75,
        opacity: 0,
        filter: "blur(18px)",
        force3D: true,
      });
      break;
    case "fade-in":
      gsap.set(target, {
        scale: 0.82,
        opacity: 0,
        filter: "blur(24px)",
        force3D: true,
      });
      break;
    default:
      gsap.set(target, {
        opacity: 0,
        filter: "blur(16px)",
        force3D: true,
      });
      break;
  }
}

/**
 * Menjalankan animasi Masuk (Mount) berbasis teori fisika (GSAP)
 */
export function playPhysicsMountAnimation(
  target: HTMLElement,
  animationName: AnimationName,
  onComplete?: () => void,
) {
  setInitialPreMountState(target, animationName);

  if (animationName === "none") {
    onComplete?.();
    return;
  }

  switch (animationName) {
    case "spring-pop": {
      // Teori Pegas Hooke: F = -kx - cv. Overshoot elastis 2.2
      gsap.to(target, {
        scale: 1,
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.9,
        ease: "back.out(2.2)",
        onComplete,
      });
      break;
    }

    case "bounce-drop": {
      // Teori Gravitasi & Koefisien Restitusi: Pantulan berulang
      gsap.to(target, {
        y: 0,
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.05,
        ease: "bounce.out",
        onComplete,
      });
      break;
    }

    case "pendulum-swing": {
      // Teori Bandul Sederhana: Osilasi harmonik teredam dari poros atas
      gsap.to(target, {
        rotation: 0,
        x: 0,
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.25,
        ease: "elastic.out(1.15, 0.45)",
        onComplete,
      });
      break;
    }

    case "magnetic-pull": {
      // Teori Gaya Magnet: F ~ 1/r^2
      gsap.to(target, {
        x: 0,
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.72,
        ease: "back.out(2.6)",
        onComplete,
      });
      break;
    }

    case "zoom-blur": {
      // Teori Kecepatan Relativistik
      gsap.to(target, {
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.88,
        ease: "expo.out",
        onComplete,
      });
      break;
    }

    case "float-rise": {
      // Teori Gaya Apung Archimedes
      gsap.to(target, {
        y: 0,
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.15,
        ease: "power4.out",
        onComplete,
      });
      break;
    }

    case "fade-up": {
      // Impuls Kinetik Naik Halus
      gsap.to(target, {
        y: 0,
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.82,
        ease: "power4.out",
        onComplete,
      });
      break;
    }

    case "fade-down": {
      // Impuls Kinetik Turun Halus
      gsap.to(target, {
        y: 0,
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.82,
        ease: "power4.out",
        onComplete,
      });
      break;
    }

    case "fade-left":
    case "fade-right": {
      // Inersia Geser Halus
      gsap.to(target, {
        x: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.82,
        ease: "power4.out",
        onComplete,
      });
      break;
    }

    case "fade-in": {
      // Fokus Optik Lensa Kamera
      gsap.to(target, {
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.78,
        ease: "power2.out",
        onComplete,
      });
      break;
    }

    default: {
      gsap.to(target, {
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.5,
        onComplete,
      });
    }
  }
}

/**
 * Menjalankan animasi Keluar (Unmount) berbasis teori fisika (GSAP)
 */
export function playPhysicsUnmountAnimation(
  target: HTMLElement,
  animationName: AnimationName,
  onComplete?: () => void,
) {
  gsap.killTweensOf(target);

  if (animationName === "none") {
    onComplete?.();
    return;
  }

  // Set origin state normal sebelum keluar
  gsap.set(target, {
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    opacity: 1,
    filter: "blur(0px)",
    transformOrigin: "50% 50%",
  });

  switch (animationName) {
    case "spring-collapse": {
      // Keruntuhan Pegas: Pre-stretch sedikit lalu menciut cepat
      gsap.to(target, {
        scale: 0.08,
        y: -18,
        opacity: 0,
        filter: "blur(24px)",
        duration: 0.48,
        ease: "back.in(2.2)",
        onComplete,
      });
      break;
    }

    case "drop-fade": {
      // Jatuh Bebas Gravitasi Terdisipasi
      gsap.to(target, {
        y: 130,
        scale: 0.88,
        opacity: 0,
        filter: "blur(22px)",
        duration: 0.52,
        ease: "power3.in",
        onComplete,
      });
      break;
    }

    case "pendulum-exit": {
      // Ayunan Sentrifugal Terlempar Keluar
      gsap.set(target, { transformOrigin: "50% -20%" });
      gsap.to(target, {
        rotation: 40,
        x: 80,
        y: 60,
        opacity: 0,
        filter: "blur(18px)",
        duration: 0.5,
        ease: "power2.in",
        onComplete,
      });
      break;
    }

    case "zoom-out-warp": {
      // Tersedot Ke Kedalaman Belakang
      gsap.to(target, {
        scale: 0.12,
        opacity: 0,
        filter: "blur(28px)",
        duration: 0.46,
        ease: "expo.in",
        onComplete,
      });
      break;
    }

    case "fade-up": {
      // Meluncur Cepat Lepas ke Atas
      gsap.to(target, {
        y: -85,
        scale: 0.9,
        opacity: 0,
        filter: "blur(18px)",
        duration: 0.46,
        ease: "power3.in",
        onComplete,
      });
      break;
    }

    case "fade-down": {
      // Tenggelam Cepat ke Bawah
      gsap.to(target, {
        y: 85,
        scale: 0.9,
        opacity: 0,
        filter: "blur(18px)",
        duration: 0.46,
        ease: "power3.in",
        onComplete,
      });
      break;
    }

    case "fade-left": {
      // Terlempar ke Kiri
      gsap.to(target, {
        x: -95,
        opacity: 0,
        filter: "blur(18px)",
        duration: 0.46,
        ease: "power3.in",
        onComplete,
      });
      break;
    }

    case "fade-right": {
      // Terlempar ke Kanan
      gsap.to(target, {
        x: 95,
        opacity: 0,
        filter: "blur(18px)",
        duration: 0.46,
        ease: "power3.in",
        onComplete,
      });
      break;
    }

    case "fade-out":
    default: {
      // Defokus Lensa Halus
      gsap.to(target, {
        scale: 0.85,
        opacity: 0,
        filter: "blur(24px)",
        duration: 0.46,
        ease: "power2.in",
        onComplete,
      });
      break;
    }
  }
}
