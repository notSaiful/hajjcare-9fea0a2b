import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// Mock modules before importing the component
const mockUseUserRole = vi.fn();
const mockUseHajis = vi.fn();
const mockUseEmergencyAlert = vi.fn();

vi.mock("@/hooks/useUserRole", () => ({
  useUserRole: () => mockUseUserRole(),
}));

vi.mock("@/hooks/useHajis", () => ({
  useHajis: () => mockUseHajis(),
}));

vi.mock("@/hooks/useEmergencyAlert", () => ({
  useEmergencyAlert: () => mockUseEmergencyAlert(),
}));

vi.mock("@/contexts/LanguageContext", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as object),
    useLanguage: () => ({
      language: "en",
      isRTL: false,
      t: (key: string) => key,
      setLanguage: vi.fn(),
    }),
    LanguageProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    isAuthenticated: false,
    signOut: vi.fn(),
    user: null,
  }),
}));

vi.mock("sonner", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null }),
    })),
  },
}));

import InspectorDashboardPage from "@/pages/InspectorDashboardPage";

const defaultHajisReturn = {
  hajis: [],
  isLoading: false,
  isUsingDemo: true,
  updateHajiStatus: vi.fn(),
};

const defaultAlertReturn = {
  triggerAlertOnce: vi.fn(),
  startEmergencyAlert: vi.fn(),
  stopEmergencyAlert: vi.fn(),
  isAlertActive: false,
};

const renderPage = () =>
  render(
    <MemoryRouter>
      <InspectorDashboardPage />
    </MemoryRouter>
  );

describe("InspectorDashboardPage — Role-Based Access", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseHajis.mockReturnValue(defaultHajisReturn);
    mockUseEmergencyAlert.mockReturnValue(defaultAlertReturn);
  });

  it("shows loading spinner while roles are being fetched", () => {
    mockUseUserRole.mockReturnValue({
      roles: [],
      isLoading: true,
      isCoordinator: false,
      isAdmin: false,
      isMedicalStaff: false,
      isInspector: false,
      hasAnyCoordinatorRole: false,
    });

    const { container } = renderPage();
    expect(container.querySelector(".animate-spin")).toBeTruthy();
  });

  it("shows UnauthorizedAlert for regular user with no roles", () => {
    mockUseUserRole.mockReturnValue({
      roles: [],
      isLoading: false,
      isCoordinator: false,
      isAdmin: false,
      isMedicalStaff: false,
      isInspector: false,
      hasAnyCoordinatorRole: false,
    });

    renderPage();
    expect(screen.getByText("Access Denied")).toBeInTheDocument();
  });

  it("shows UnauthorizedAlert for unauthenticated user", () => {
    mockUseUserRole.mockReturnValue({
      roles: [],
      isLoading: false,
      isCoordinator: false,
      isAdmin: false,
      isMedicalStaff: false,
      isInspector: false,
      hasAnyCoordinatorRole: false,
    });

    renderPage();
    expect(screen.getByText("Access Denied")).toBeInTheDocument();
    expect(screen.getByText(/Go to Home/i)).toBeInTheDocument();
  });

  it("grants access to inspector role", () => {
    mockUseUserRole.mockReturnValue({
      roles: [{ role: "inspector", zone: null }],
      isLoading: false,
      isCoordinator: false,
      isAdmin: false,
      isMedicalStaff: false,
      isInspector: true,
      hasAnyCoordinatorRole: true,
    });

    renderPage();
    expect(screen.queryByText("Access Denied")).not.toBeInTheDocument();
    expect(screen.getByText("Inspector Dashboard")).toBeInTheDocument();
  });

  it("grants access to admin role", () => {
    mockUseUserRole.mockReturnValue({
      roles: [{ role: "admin", zone: null }],
      isLoading: false,
      isCoordinator: false,
      isAdmin: true,
      isMedicalStaff: false,
      isInspector: false,
      hasAnyCoordinatorRole: true,
    });

    renderPage();
    expect(screen.queryByText("Access Denied")).not.toBeInTheDocument();
    expect(screen.getByText("Inspector Dashboard")).toBeInTheDocument();
  });

  it("grants access to coordinator role", () => {
    mockUseUserRole.mockReturnValue({
      roles: [{ role: "coordinator", zone: "Makkah" }],
      isLoading: false,
      isCoordinator: true,
      isAdmin: false,
      isMedicalStaff: false,
      isInspector: false,
      hasAnyCoordinatorRole: true,
    });

    renderPage();
    expect(screen.queryByText("Access Denied")).not.toBeInTheDocument();
    expect(screen.getByText("Inspector Dashboard")).toBeInTheDocument();
  });

  it("grants access to medical_staff role", () => {
    mockUseUserRole.mockReturnValue({
      roles: [{ role: "medical_staff", zone: "Mina" }],
      isLoading: false,
      isCoordinator: false,
      isAdmin: false,
      isMedicalStaff: true,
      isInspector: false,
      hasAnyCoordinatorRole: true,
    });

    renderPage();
    expect(screen.queryByText("Access Denied")).not.toBeInTheDocument();
    expect(screen.getByText("Inspector Dashboard")).toBeInTheDocument();
  });

  it("blocks pure 'user' role from accessing dashboard", () => {
    mockUseUserRole.mockReturnValue({
      roles: [{ role: "user", zone: null }],
      isLoading: false,
      isCoordinator: false,
      isAdmin: false,
      isMedicalStaff: false,
      isInspector: false,
      hasAnyCoordinatorRole: false,
    });

    renderPage();
    expect(screen.getByText("Access Denied")).toBeInTheDocument();
  });
});
