"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NewHereButton } from "@/components/OnboardingTour";
import { DarkModeToggle } from "@/components/DarkModeToggle";

const NAV_LINKS = [
  { label: "Discover", href: "/" },
  { label: "Board", href: "/board" },
  { label: "My Posts", href: "/posts" },
  { label: "My Matches", href: "/matches" },
  { label: "Directory", href: "/directory" },
  { label: "Profile", href: "/profile" },
];

export function Nav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <nav
      className="flex items-center justify-between sticky top-0 z-100"
      style={{
        padding: "16px 32px",
        borderBottom: "1px solid var(--nav-border)",
        background: "var(--nav-bg)",
      }}
    >
      <div className="flex items-center" style={{ gap: "16px" }}>
        <Link
          href="/"
          className="no-underline"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "20px",
            color: "var(--coastal-900)",
            fontWeight: 400,
          }}
        >
          Coastal Wealth
        </Link>
        <div
          style={{
            width: "1px",
            height: "20px",
            background: "var(--gray-200)",
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: "13px",
            color: "var(--coastal-600)",
            fontWeight: 500,
            letterSpacing: "0.3px",
          }}
        >
          AdvisorConnect
        </span>
      </div>

      <ul
        className="list-none items-center hidden md:flex"
        style={{ gap: "var(--space-5)" }}
      >
        {NAV_LINKS.map((link) => {
          const active = isActive(link.href);
          return (
            <li key={link.label}>
              <Link
                href={link.href}
                className="relative no-underline"
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: "13px",
                  color: active ? "var(--text-primary)" : "var(--text-secondary)",
                  fontWeight: active ? 500 : 400,
                  transition: "color var(--duration-fast)",
                }}
              >
                {link.label}
                {active && (
                  <span
                    className="absolute left-0 right-0"
                    style={{
                      bottom: "-4px",
                      height: "1.5px",
                      background: "var(--coastal-600)",
                    }}
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="flex items-center" style={{ gap: "var(--space-4)" }}>
        <NewHereButton />
        <DarkModeToggle />
        <button
          className="relative flex items-center justify-center cursor-pointer"
          style={{
            width: "36px",
            height: "36px",
            border: "1px solid var(--gray-200)",
            background: "var(--white)",
            transition: "all var(--duration-fast)",
          }}
          title="3 new matches"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--gray-500)"
            strokeWidth="2"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span
            className="absolute flex items-center justify-center"
            style={{
              top: "-4px",
              right: "-4px",
              width: "16px",
              height: "16px",
              background: "var(--error)",
              color: "var(--white)",
              fontSize: "9px",
              fontWeight: 600,
              borderRadius: "50%",
            }}
          >
            3
          </span>
        </button>
        <div
          className="flex items-center justify-center cursor-pointer"
          style={{
            width: "32px",
            height: "32px",
            background: "var(--coastal-600)",
            borderRadius: "50%",
            color: "var(--white)",
            fontSize: "12px",
            fontWeight: 500,
          }}
          title="KD"
        >
          KD
        </div>
      </div>
    </nav>
  );
}
