import { useState, useEffect, useCallback } from "react";

// Hajj sacred sites coordinates
export const HAJJ_LOCATIONS = {
  kaaba: { lat: 21.4225, lng: 39.8262, radiusKm: 0.5 },
  safa: { lat: 21.4233, lng: 39.8265, radiusKm: 0.2 },
  marwa: { lat: 21.4260, lng: 39.8268, radiusKm: 0.2 },
  mina: { lat: 21.4134, lng: 39.8933, radiusKm: 2 },
  arafat: { lat: 21.3549, lng: 39.9842, radiusKm: 3 },
  muzdalifah: { lat: 21.3833, lng: 39.9333, radiusKm: 2 },
  jamarat: { lat: 21.4200, lng: 39.8728, radiusKm: 0.3 },
} as const;

export type HajjStage = 
  | "kaaba"
  | "safa_marwa"
  | "mina"
  | "arafat"
  | "muzdalifah"
  | "jamarat"
  | "outside"
  | "unknown";

export interface HajjStageInfo {
  id: HajjStage;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  nextStageAr: string;
  nextStageEn: string;
  tipsAr: string[];
  tipsEn: string[];
  color: string;
}

export const HAJJ_STAGES: Record<HajjStage, HajjStageInfo> = {
  kaaba: {
    id: "kaaba",
    nameAr: "الكعبة المشرفة",
    nameEn: "Holy Kaaba",
    descriptionAr: "أنت بالقرب من الكعبة المشرفة - قم بأداء الطواف",
    descriptionEn: "You are near the Holy Kaaba - Perform Tawaf",
    nextStageAr: "بعد الطواف، توجه إلى الصفا للبدء بالسعي",
    nextStageEn: "After Tawaf, head to Safa to begin Sa'i",
    tipsAr: [
      "ابدأ الطواف من الحجر الأسود",
      "اجعل الكعبة على يسارك",
      "ادعُ الله بما شئت أثناء الطواف",
    ],
    tipsEn: [
      "Start Tawaf from the Black Stone",
      "Keep the Kaaba on your left",
      "Make dua as you wish during Tawaf",
    ],
    color: "#D4AF37",
  },
  safa_marwa: {
    id: "safa_marwa",
    nameAr: "الصفا والمروة",
    nameEn: "Safa & Marwa",
    descriptionAr: "أنت في منطقة السعي بين الصفا والمروة",
    descriptionEn: "You are in the Sa'i area between Safa and Marwa",
    nextStageAr: "أكمل 7 أشواط ثم توجه إلى منى",
    nextStageEn: "Complete 7 rounds then head to Mina",
    tipsAr: [
      "ابدأ من الصفا وانتهِ بالمروة",
      "أسرع في الخطى بين العلمين الأخضرين",
      "ادعُ الله على الصفا والمروة",
    ],
    tipsEn: [
      "Start from Safa and end at Marwa",
      "Walk briskly between the green markers",
      "Make dua at Safa and Marwa",
    ],
    color: "#4A7C59",
  },
  mina: {
    id: "mina",
    nameAr: "منى",
    nameEn: "Mina",
    descriptionAr: "أنت في منى - مدينة الخيام",
    descriptionEn: "You are in Mina - City of Tents",
    nextStageAr: "في يوم التروية، استعد للتوجه إلى عرفات فجراً",
    nextStageEn: "On Day of Tarwiyah, prepare to head to Arafat at dawn",
    tipsAr: [
      "أكثر من التلبية والذكر",
      "احفظ رقم خيمتك ومجموعتك",
      "اشرب الماء بكثرة",
    ],
    tipsEn: [
      "Increase Talbiyah and Dhikr",
      "Remember your tent number and group",
      "Stay hydrated",
    ],
    color: "#C9A227",
  },
  arafat: {
    id: "arafat",
    nameAr: "عرفات",
    nameEn: "Arafat",
    descriptionAr: "أنت في عرفات - أعظم أركان الحج",
    descriptionEn: "You are in Arafat - The Greatest Pillar of Hajj",
    nextStageAr: "بعد غروب الشمس، انطلق إلى مزدلفة",
    nextStageEn: "After sunset, depart to Muzdalifah",
    tipsAr: [
      "الحج عرفة - أكثر من الدعاء",
      "الوقوف يبدأ من الزوال إلى غروب الشمس",
      "لا تغادر قبل الغروب",
    ],
    tipsEn: [
      "Hajj is Arafat - Make abundant dua",
      "Standing starts from noon until sunset",
      "Do not leave before sunset",
    ],
    color: "#8B4513",
  },
  muzdalifah: {
    id: "muzdalifah",
    nameAr: "مزدلفة",
    nameEn: "Muzdalifah",
    descriptionAr: "أنت في مزدلفة - اجمع الحصى للرمي",
    descriptionEn: "You are in Muzdalifah - Collect pebbles for stoning",
    nextStageAr: "بعد الفجر، توجه إلى منى لرمي جمرة العقبة",
    nextStageEn: "After Fajr, head to Mina for stoning Jamrat al-Aqaba",
    tipsAr: [
      "اجمع 70 حصاة على الأقل",
      "صلِّ المغرب والعشاء جمعاً وقصراً",
      "بِت في مزدلفة حتى الفجر",
    ],
    tipsEn: [
      "Collect at least 70 pebbles",
      "Pray Maghrib and Isha combined and shortened",
      "Stay in Muzdalifah until Fajr",
    ],
    color: "#2F4F4F",
  },
  jamarat: {
    id: "jamarat",
    nameAr: "الجمرات",
    nameEn: "Jamarat",
    descriptionAr: "أنت عند الجمرات - موقع رمي الجمار",
    descriptionEn: "You are at Jamarat - Stoning site",
    nextStageAr: "بعد الرمي، اذبح الهدي ثم احلق أو قصر",
    nextStageEn: "After stoning, sacrifice and then shave or trim hair",
    tipsAr: [
      "ارمِ 7 حصيات مع التكبير",
      "تجنب أوقات الزحام الشديد",
      "اتبع المسار المحدد",
    ],
    tipsEn: [
      "Throw 7 pebbles with Takbir",
      "Avoid peak crowding times",
      "Follow the designated path",
    ],
    color: "#800020",
  },
  outside: {
    id: "outside",
    nameAr: "خارج المشاعر",
    nameEn: "Outside Sacred Sites",
    descriptionAr: "أنت خارج نطاق المشاعر المقدسة",
    descriptionEn: "You are outside the sacred sites area",
    nextStageAr: "توجه إلى أقرب موقع للحج",
    nextStageEn: "Head to the nearest Hajj site",
    tipsAr: [
      "تأكد من تفعيل GPS",
      "راجع جدول مجموعتك",
    ],
    tipsEn: [
      "Make sure GPS is enabled",
      "Check your group schedule",
    ],
    color: "#808080",
  },
  unknown: {
    id: "unknown",
    nameAr: "جاري التحديد",
    nameEn: "Determining Location",
    descriptionAr: "جاري تحديد موقعك...",
    descriptionEn: "Determining your location...",
    nextStageAr: "فعّل خدمات الموقع",
    nextStageEn: "Enable location services",
    tipsAr: ["فعّل GPS للحصول على الإرشادات"],
    tipsEn: ["Enable GPS for guidance"],
    color: "#808080",
  },
};

// Calculate distance between two coordinates using Haversine formula
function getDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function determineStage(lat: number, lng: number): HajjStage {
  // Check each location from most specific to least
  const distToKaaba = getDistanceKm(lat, lng, HAJJ_LOCATIONS.kaaba.lat, HAJJ_LOCATIONS.kaaba.lng);
  if (distToKaaba <= HAJJ_LOCATIONS.kaaba.radiusKm) return "kaaba";

  const distToSafa = getDistanceKm(lat, lng, HAJJ_LOCATIONS.safa.lat, HAJJ_LOCATIONS.safa.lng);
  const distToMarwa = getDistanceKm(lat, lng, HAJJ_LOCATIONS.marwa.lat, HAJJ_LOCATIONS.marwa.lng);
  if (distToSafa <= HAJJ_LOCATIONS.safa.radiusKm || distToMarwa <= HAJJ_LOCATIONS.marwa.radiusKm) {
    return "safa_marwa";
  }

  const distToJamarat = getDistanceKm(lat, lng, HAJJ_LOCATIONS.jamarat.lat, HAJJ_LOCATIONS.jamarat.lng);
  if (distToJamarat <= HAJJ_LOCATIONS.jamarat.radiusKm) return "jamarat";

  const distToMina = getDistanceKm(lat, lng, HAJJ_LOCATIONS.mina.lat, HAJJ_LOCATIONS.mina.lng);
  if (distToMina <= HAJJ_LOCATIONS.mina.radiusKm) return "mina";

  const distToMuzdalifah = getDistanceKm(lat, lng, HAJJ_LOCATIONS.muzdalifah.lat, HAJJ_LOCATIONS.muzdalifah.lng);
  if (distToMuzdalifah <= HAJJ_LOCATIONS.muzdalifah.radiusKm) return "muzdalifah";

  const distToArafat = getDistanceKm(lat, lng, HAJJ_LOCATIONS.arafat.lat, HAJJ_LOCATIONS.arafat.lng);
  if (distToArafat <= HAJJ_LOCATIONS.arafat.radiusKm) return "arafat";

  return "outside";
}

export interface LocationState {
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
  stage: HajjStage;
  stageInfo: HajjStageInfo;
  error: string | null;
  isLoading: boolean;
  isStale: boolean;
  lastUpdatedAt: number | null;
}

export function useHajjLocation() {
  const [state, setState] = useState<LocationState>({
    lat: null,
    lng: null,
    accuracy: null,
    stage: "unknown",
    stageInfo: HAJJ_STAGES.unknown,
    error: null,
    isLoading: true,
    isStale: false,
    lastUpdatedAt: null,
  });

  const updateLocation = useCallback((position: GeolocationPosition) => {
    const { latitude, longitude, accuracy } = position.coords;
    const stage = determineStage(latitude, longitude);
    setState({
      lat: latitude,
      lng: longitude,
      accuracy,
      stage,
      stageInfo: HAJJ_STAGES[stage],
      error: null,
      isLoading: false,
      isStale: false,
      lastUpdatedAt: Date.now(),
    });
  }, []);

  const handleError = useCallback((error: GeolocationPositionError) => {
    let errorMsg = "Unable to get location";
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMsg = "Location permission denied";
        break;
      case error.POSITION_UNAVAILABLE:
        errorMsg = "Location unavailable";
        break;
      case error.TIMEOUT:
        errorMsg = "Location request timeout";
        break;
    }

    // For timeout or position unavailable, preserve last known location but mark as stale
    const isRecoverable = error.code === error.TIMEOUT || error.code === error.POSITION_UNAVAILABLE;

    setState((prev) => {
      if (isRecoverable && prev.lat !== null && prev.lng !== null) {
        return {
          ...prev,
          error: errorMsg,
          isLoading: false,
          isStale: true,
        };
      }
      return {
        ...prev,
        error: errorMsg,
        isLoading: false,
        stage: "unknown",
        stageInfo: HAJJ_STAGES.unknown,
        isStale: false,
        lastUpdatedAt: null,
      };
    });
  }, []);

  const requestLocation = useCallback(() => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "Geolocation not supported",
        isLoading: false,
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(updateLocation, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000,
    });
  }, [updateLocation, handleError]);

  useEffect(() => {
    requestLocation();

    // Watch position for real-time updates
    const watchId = navigator.geolocation?.watchPosition(
      updateLocation,
      handleError,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    );

    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [requestLocation, updateLocation, handleError]);

  return { ...state, refresh: requestLocation };
}
