"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ChevronLeft, Flame, UtensilsCrossed, Pencil } from "lucide-react";

export default function MealDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [meal, setMeal] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const appFont =
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

  useEffect(() => {
    async function load() {
      if (!id) return;
      const supabase = createClient();
      const { data } = await supabase
        .from("meals")
        .select("*")
        .eq("id", id)
        .single();
      if (data) setMeal(data);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <main
        style={{
          backgroundColor: "#000",
          minHeight: "100vh",
        }}
      />
    );
  }

  if (!meal) {
    return (
      <main
        style={{
          backgroundColor: "#000",
          minHeight: "100vh",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: appFont,
        }}
      >
        <p>Meal not found.</p>
      </main>
    );
  }

  return (
    <main
      style={{
        backgroundColor: "#000",
        minHeight: "100vh",
        color: "#fff",
        fontFamily: appFont,
        paddingBottom: "48px",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link href="/" style={{ color: "#666", textDecoration: "none" }}>
          <ChevronLeft size={28} />
        </Link>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "#f97316",
          }}
        >
          <UtensilsCrossed size={16} />
          <span
            style={{
              fontSize: "10px",
              fontWeight: 900,
              letterSpacing: "0.18em",
            }}
          >
            MEAL
          </span>
        </div>
        <Link
          href={`/admin/edit/${meal.id}`}
          style={{
            color: "#fff",
            textDecoration: "none",
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <Pencil size={16} />
          Edit
        </Link>
      </header>

      {/* Image */}
      <div
        style={{
          padding: "0 20px 20px 20px",
        }}
      >
        <div
          style={{
            width: "100%",
            borderRadius: "32px",
            overflow: "hidden",
            backgroundColor: "#121212",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <img
            src={meal.image_url || "https://placehold.co/800x600"}
            alt=""
            style={{ width: "100%", height: "260px", objectFit: "cover" }}
          />
        </div>
      </div>

      {/* Content */}
      <section style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "26px",
              fontWeight: 800,
              letterSpacing: "-0.03em",
            }}
          >
            {meal.name_en}
          </h1>
          {meal.name_cn && (
            <p
              style={{
                margin: "4px 0 0 0",
                color: "#888",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              {meal.name_cn}
            </p>
          )}
        </div>

        {/* Spicy */}
        <div>
          <label
            style={{
              fontSize: "10px",
              fontWeight: 900,
              color: "#666",
              display: "block",
              marginBottom: "6px",
            }}
          >
            SPICY LEVEL
          </label>
          <div style={{ display: "flex", gap: "4px" }}>
            {[...Array(5)].map((_, i) => (
              <Flame
                key={i}
                size={18}
                fill={i < (meal.spicy_level || 0) ? "#f97316" : "none"}
                color={i < (meal.spicy_level || 0) ? "#f97316" : "#222"}
              />
            ))}
          </div>
        </div>

        {/* Labels */}
        {meal.label && (
          <div>
            <label
              style={{
                fontSize: "10px",
                fontWeight: 900,
                color: "#666",
                display: "block",
                marginBottom: "6px",
              }}
            >
              LABELS
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {String(meal.label)
                .split(",")
                .map((l: string) => l.trim())
                .filter(Boolean)
                .map((l: string) => (
                  <span
                    key={l}
                    style={{
                      backgroundColor: "rgba(255,255,255,0.08)",
                      padding: "6px 12px",
                      borderRadius: "999px",
                      fontSize: "12px",
                    }}
                  >
                    {l}
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Description */}
        {meal.description && (
          <div>
            <label
              style={{
                fontSize: "10px",
                fontWeight: 900,
                color: "#666",
                display: "block",
                marginBottom: "6px",
              }}
            >
              NOTES
            </label>
            <p
              style={{
                margin: 0,
                fontSize: "15px",
                lineHeight: 1.6,
                color: "#ddd",
              }}
            >
              {meal.description}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

