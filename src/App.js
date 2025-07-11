import emailjs from '@emailjs/browser';
import { useState } from 'react';

export default function App() {
  // Dodaj stanja za nova polja
  const [porudzbina, setPorudzbina] = useState([]);
  const [status, setStatus] = useState('');
  const [email, setEmail] = useState('');
  const [imeprezime, setImeprezime] = useState('');
  const [telefon, setTelefon] = useState('');

  // ... tvoji proizvodi ...
  const proizvodi = [
    { ime: 'Brokoli', status: 'Dostupno', slika: 'brokoli.jpg' },
    { ime: 'Bosiljak', status: 'Uskoro dostupno', slika: 'bosiljak.jpg' },
    // ... ostale biljke ...
  ];

  const [odabranaGramaza, setOdabranaGramaza] = useState({});
  const cene = { '30g': 250, '50g': 400 };

  const dodajUkorpu = (proizvod) => {
    const gramaza = odabranaGramaza[proizvod.ime] || '30g';
    setPorudzbina([...porudzbina, {
      ...proizvod,
      gramaza,
      cena: cene[gramaza]
    }]);
  };

  const ukloniProizvod = (index) => {
    const novaLista = [...porudzbina];
    novaLista.splice(index, 1);
    setPorudzbina(novaLista);
  };

  function posaljiNarudzbinu() {
    if (porudzbina.length === 0) {
      setStatus('Korpa je prazna.');
      return;
    }
    if (!imeprezime.trim() || !telefon.trim() || !email.trim()) {
      setStatus('Molimo unesite ime i prezime, telefon i email adresu.');
      return;
    }

    const orders = porudzbina.map(p => `${p.ime} (${p.gramaza}) - ${p.cena} RSD`).join('\n');
    const totalPrice = porudzbina.reduce((acc, item) => acc + item.cena, 0);

    const templateParams = {
      order_id: Math.floor(Math.random() * 100000),
      imeprezime: imeprezime.trim(),
      telefon: telefon.trim(),
      email: email.trim(),
      orders: orders,
      price: totalPrice
    };

    emailjs.send('service_nw0o8sd', 'template_2a2f5sr', templateParams, 'OZIzXvYjWtayN02p1')
      .then(() => {
        setStatus('Narudžbina je uspešno poslata!');
        setPorudzbina([]);
        setImeprezime('');
        setTelefon('');
        setEmail('');
      })
      .catch((error) => {
        console.error('EmailJS greška:', error);
        setStatus('Došlo je do greške pri slanju.');
      });
  }

  return (
    <div className="p-4 min-h-screen bg-[#fdf3e7] text-green-800 font-sans">
      {/* ... tvoj header ... */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Naša ponuda</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {proizvodi.map((p, i) => (
            <div key={i} className="border border-green-100 rounded-2xl bg-white shadow p-4">
              <img src={`/images/${p.slika}`} alt={p.ime} className="w-full h-32 object-cover rounded-xl mb-2" />
              <h3 className="text-lg font-bold mb-1">{p.ime}</h3>
              <div className="mb-1">
                <label className="mr-2 font-medium">Gramaža:</label>
                <select
                  value={odabranaGramaza[p.ime] || '30g'}
                  onChange={e =>
                    setOdabranaGramaza({ ...odabranaGramaza, [p.ime]: e.target.value })
                  }
                  className="border rounded px-2 py-1"
                >
                  <option value="30g">30g - 250 RSD</option>
                  <option value="50g">50g - 400 RSD</option>
                </select>
              </div>
              <p className={`text-xs mt-1 ${p.status === 'Dostupno' ? 'text-green-600' : p.status === 'Uskoro dostupno' ? 'text-yellow-600' : 'text-red-500'}`}>
                {p.status}
              </p>
              <button
                onClick={() => dodajUkorpu(p)}
                className="mt-3 text-sm bg-green-200 hover:bg-green-300 text-green-900 px-3 py-1 rounded-xl"
                disabled={p.status !== 'Dostupno'}
              >
                Dodaj u narudžbinu
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-3">🛒 Tvoja narudžbina</h2>
        {porudzbina.length === 0 ? (
          <p className="text-sm italic">Još uvek nema dodatih proizvoda.</p>
        ) : (
          <ul className="list-disc pl-4 space-y-1">
            {porudzbina.map((item, i) => (
              <li key={i} className="flex items-center justify-between">
                <span>{item.ime} - {item.gramaza} - {item.cena} RSD</span>
                <button onClick={() => ukloniProizvod(i)} className="text-red-600 text-xs hover:underline">
                  Ukloni proizvod
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* POLJA ZA UNOS */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            type="text"
            value={imeprezime}
            onChange={e => setImeprezime(e.target.value)}
            className="p-2 border border-green-400 rounded"
            placeholder="Ime i prezime"
            required
          />
          <input
            type="tel"
            value={telefon}
            onChange={e => setTelefon(e.target.value)}
            className="p-2 border border-green-400 rounded"
            placeholder="Telefon"
            required
          />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="p-2 border border-green-400 rounded"
            placeholder="Email"
            required
          />
        </div>

        {porudzbina.length > 0 && (
          <div className="text-center mt-4">
            <button onClick={posaljiNarudzbinu} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full shadow">
              Pošalji narudžbinu
            </button>
            {status && <p className="mt-2 text-sm text-green-800">{status}</p>}
          </div>
        )}
      </section>
    </div>
  );
}
