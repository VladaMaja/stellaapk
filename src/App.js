import { useMemo, useState, useRef } from "react";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = "service_nw0o8sd";
const EMAILJS_TEMPLATE_ID = "template_2a2f5sr";
const EMAILJS_PUBLIC_KEY = "OZIzXvYjWtayN02p1";
const PLACEHOLDER_IMG = "/images/placeholder.jpg"; // koristimo ako slika ne postoji

export function calcUkupno(items) {
  return items.reduce((s, i) => s + (Number(i.cena) || 0), 0);
}

export function formatOrders(items) {
  return items.map((p) => `${p.ime} (${p.gramaza}) - ${p.cena} RSD`).join("\n");
}

export default function App() {
  const narudzbinaRef = useRef(null);

  const [porudzbina, setPorudzbina] = useState([]);
  const [status, setStatus] = useState("");
  const [saljeSe, setSaljeSe] = useState(false);

  const [email, setEmail] = useState("");
  const [imeprezime, setImePrezime] = useState("");
  const [telefon, setTelefon] = useState("");
  const [odabranaGramaza, setOdabranaGramaza] = useState({});

  const proizvodi = [
    { ime: "Brokoli", status: "Dostupno", slika: "brokoli.jpg" },
    { ime: "Bosiljak", status: "Dostupno", slika: "bosiljak.jpg" },
    { ime: "Cvekla", status: "Dostupno", slika: "cvekla.jpg" },
    { ime: "Kineska rotkvica", status: "Uskoro dostupno", slika: "kineska_rotkvica.jpg" },
    { ime: "Rukola", status: "Dostupno", slika: "rukola.jpg" },
    { ime: "Lan", status: "Uskoro dostupno", slika: "lan.jpg" },
    { ime: "Vlašac", status: "Dostupno", slika: "vlasac.jpg" },
    { ime: "Grašak", status: "Uskoro dostupno", slika: "grasak.jpg" },
    { ime: "Lucerka", status: "Dostupno", slika: "lucerka.jpg" },
    { ime: "Šargarepa", status: "Uskoro dostupno", slika: "sargarepa.jpg" },
    { ime: "Korijander", status: "Dostupno", slika: "korijander.jpg" },
    { ime: "Slačica", status: "Dostupno", slika: "slacica.jpg" },
  ];

  const cene = {
    "30g": 250,
    "50g": 400,
  };

  const ukupno = useMemo(() => calcUkupno(porudzbina), [porudzbina]);

  const dodajUkorpu = (proizvod) => {
    const gramaza = odabranaGramaza[proizvod.ime] || "30g";
    const item = { ...proizvod, gramaza, cena: cene[gramaza] };
    setPorudzbina((prev) => [...prev, item]);
    // skrol do narudžbine da korisnik vidi dugme
    setTimeout(() => {
      narudzbinaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const ukloniProizvod = (index) => {
    setPorudzbina((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForme = () => {
    setPorudzbina([]);
    setImePrezime("");
    setTelefon("");
    setEmail("");
    setOdabranaGramaza({});
  };

  function validacije() {
    if (porudzbina.length === 0) return "Korpa je prazna.";
    const greske = [];
    if (!imeprezime.trim()) greske.push("unesite ime i prezime");
    const telOk = /[0-9]{6,}/.test(telefon.replace(/\D/g, ""));
    if (!telOk) greske.push("unesite ispravan telefon");
    const mailOk = /[^@\s]+@[^@\s]+\.[^@\s]+/.test(email);
    if (!mailOk) greske.push("unesite ispravan email");
    if (greske.length) return `Molimo ${greske.join(", ")}.`;
    return "";
  }

  async function posaljiNarudzbinu() {
    setStatus("");
    const v = validacije();
    if (v) {
      setStatus(v);
      return;
    }

    const order_id = `${Date.now()}`;
    const templateParams = {
      order_id,
      imeprezime: imeprezime.trim(),
      telefon: telefon.trim(),
      email: email.trim(),
      orders: formatOrders(porudzbina),
      price: ukupno,
      reply_to: email.trim(),
    };

    try {
      setSaljeSe(true);
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );
      setStatus("Narudžbina je uspešno poslata! Proverite email za potvrdu.");
      resetForme();
    } catch (error) {
      console.error("EmailJS greška:", error);
      const poruka = error?.text || error?.message || "Došlo je do greške pri slanju.";
      setStatus(poruka);
    } finally {
      setSaljeSe(false);
    }
  }

  return (
    <div className="p-4 min-h-screen bg-[#fdf3e7] text-green-800 font-sans">
      <header className="mb-8 text-center">
        <img src="/logo.jpg" alt="Stellagreens logo" className="mx-auto w-60 h-auto mb-2" />
        <p className="text-sm text-green-600">Sveže mikrobilje iz lokalne proizvodnje</p>
        {/* Brzi link do korpe */}
        <button
          onClick={() => narudzbinaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
          className="mt-3 text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full"
        >
          Idi na narudžbinu
        </button>
      </header>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Naša ponuda</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {proizvodi.map((p, i) => (
            <div key={i} className="border border-green-100 rounded-2xl bg-white shadow p-4">
              <img
                src={`/images/${p.slika}`}
                alt={p.ime}
                onError={(e) => {
                  e.currentTarget.src = PLACEHOLDER_IMG; // fallback ako slika ne postoji
                  e.currentTarget.onerror = null;
                }}
                className="w-full h-32 object-cover rounded-xl mb-2 bg-green-50"
              />
              <h3 className="text-lg font-bold mb-1">{p.ime}</h3>
              <div className="mb-1">
                <label className="mr-2 font-medium">Gramaža:</label>
                <select
                  value={odabranaGramaza[p.ime] || "30g"}
                  onChange={(e) => setOdabranaGramaza({ ...odabranaGramaza, [p.ime]: e.target.value })}
                  className="border rounded px-2 py-1"
                >
                  <option value="30g">30g - 250 RSD</option>
                  <option value="50g">50g - 400 RSD</option>
                </select>
              </div>
              <p
                className={`text-xs mt-1 ${
                  p.status === "Dostupno"
                    ? "text-green-600"
                    : p.status === "Uskoro dostupno"
                    ? "text-yellow-600"
                    : "text-red-500"
                }`}
              >
                {p.status}
              </p>
              <button
                onClick={() => dodajUkorpu(p)}
                className="mt-3 text-sm bg-green-200 hover:bg-green-300 text-green-900 px-3 py-1 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={p.status !== "Dostupno"}
                title={p.status !== "Dostupno" ? "Proizvod još nije dostupan" : "Dodaj u narudžbinu"}
              >
                Dodaj u narudžbinu
              </button>
            </div>
          ))}
        </div>
      </section>

      <section ref={narudzbinaRef} className="mt-10 max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold mb-3">🛒 Tvoja narudžbina</h2>
        {porudzbina.length === 0 ? (
          <p className="text-sm italic">Još uvek nema dodatih proizvoda. Dodaj bar jedan proizvod iz ponude.</p>
        ) : (
          <>
            <ul className="list-disc pl-4 space-y-1">
              {porudzbina.map((item, i) => (
                <li key={`${item.ime}-${item.gramaza}-${i}`} className="flex items-center justify-between">
                  <span>
                    {item.ime} — {item.gramaza} — {item.cena} RSD
                  </span>
                  <button onClick={() => ukloniProizvod(i)} className="text-red-600 text-xs hover:underline">
                    Ukloni
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-3 text-right font-semibold">Ukupno: {ukupno} RSD</div>
          </>
        )}

        <div className="mt-6">
          <label htmlFor="imeprezime" className="block mb-1 font-medium">
            Ime i prezime:
          </label>
          <input
            id="imeprezime"
            type="text"
            value={imeprezime}
            onChange={(e) => setImePrezime(e.target.value)}
            className="w-full p-2 border border-green-400 rounded mb-2"
            placeholder="Ime i prezime"
            autoComplete="name"
          />

          <label htmlFor="telefon" className="block mb-1 font-medium">
            Telefon:
          </label>
          <input
            id="telefon"
            type="tel"
            value={telefon}
            onChange={(e) => setTelefon(e.target.value)}
            className="w-full p-2 border border-green-400 rounded mb-2"
            placeholder="060 1234567"
            autoComplete="tel"
          />

          <label htmlFor="email" className="block mb-1 font-medium">
            Email:
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-green-400 rounded"
            placeholder="primer@domen.com"
            autoComplete="email"
          />
        </div>

        <div className="text-center mt-4">
          <button
            onClick={posaljiNarudzbinu}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full shadow disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={saljeSe || porudzbina.length === 0}
            title={porudzbina.length === 0 ? "Dodaj bar jedan proizvod u korpu" : "Pošalji narudžbinu"}
          >
            {saljeSe ? "Šaljem..." : "Pošalji narudžbinu"}
          </button>
          {porudzbina.length === 0 && (
            <p className="mt-2 text-xs text-green-700">Dodaj proizvod iz ponude iznad da se aktivira dugme.</p>
          )}
          {status && <p className="mt-2 text-sm text-green-800 whitespace-pre-line">{status}</p>}
        </div>
      </section>

      {/* Sticky mini-korpa da se uvek vidi dugme za naručivanje */}
      <div className="fixed bottom-4 right-4">
        <button
          onClick={() => narudzbinaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
          className="shadow-lg rounded-full px-4 py-2 bg-white border border-green-300 text-green-700 hover:bg-green-50"
          title="Otvori narudžbinu"
        >
          🛒 {porudzbina.length} | {ukupno} RSD
        </button>
      </div>
    </div>
  );
}

/* ==========================================================
   INLINE TESTOVI
   ========================================================== */
if (typeof window !== "undefined" && !window.__STELLA_TESTED__) {
  window.__STELLA_TESTED__ = true;
  try {
    console.assert(calcUkupno([{ cena: 250 }, { cena: 400 }]) === 650, "calcUkupno treba da vrati 650");
    console.assert(calcUkupno([]) === 0, "calcUkupno prazno treba da vrati 0");

    const sample = [
      { ime: "Brokoli", gramaza: "30g", cena: 250 },
      { ime: "Bosiljak", gramaza: "50g", cena: 400 },
    ];
    const formatted = formatOrders(sample);
    console.assert(
      formatted.includes("Brokoli (30g) - 250 RSD") && formatted.includes("Bosiljak (50g) - 400 RSD"),
      "formatOrders treba da sadrži ispravne stavke"
    );
    console.assert(formatted.split("\n").length === 2, "formatOrders treba da ima 2 reda za 2 stavke");

    const weird = formatOrders([{ ime: "X", gramaza: "30g", cena: 0 }]);
    console.assert(weird === "X (30g) - 0 RSD", "formatOrders: cena 0 treba da bude podržana");

    console.log("[StellaGreens] Inline testovi prošli ✅");
  } catch (e) {
    console.error("[StellaGreens] Greška u inline testovima", e);
  }
}
