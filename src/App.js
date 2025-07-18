import emailjs from '@emailjs/browser';
import { useState } from 'react';

export default function App() {
  const [porudzbina, setPorudzbina] = useState([]);
  const [status, setStatus] = useState('');
  const [email, setEmail] = useState('');
  const [imeprezime, setImePrezime] = useState('');
  const [telefon, setTelefon] = useState('');
  const [odabranaGramaza, setOdabranaGramaza] = useState({});

  const proizvodi = [
    { ime: 'Brokoli', status: 'Dostupno', slika: 'brokoli.jpg' },
    { ime: 'Bosiljak', status: 'Dostupno', slika: 'bosiljak.jpg' },
    { ime: 'Cvekla', status: 'Dostupno', slika: 'cvekla.jpg' },
    { ime: 'Kineska rotkvica', status: 'Uskoro dostupno', slika: 'kineska_rotkvica.jpg' },
    { ime: 'Rukola', status: 'Dostupno', slika: 'rukola.jpg' },
    { ime: 'Lan', status: 'Uskoro dostupno', slika: 'lan.jpg' },
    { ime: 'Vlašac', status: 'Dostupno', slika: 'vlasac.jpg' },
    { ime: 'Grašak', status: 'Uskoro dostupno', slika: 'grasak.jpg' },
    { ime: 'Lucerka', status: 'Dostupno', slika: 'lucerka.jpg' },
    { ime: 'Šargarepa', status: 'Uskoro dostupno', slika: 'sargarepa.jpg' },
    { ime: 'Korijander', status: 'Dostupno', slika: 'korijander.jpg' },
    { ime: 'Slačica', status: 'Dostupno', slika: 'slacica.jpg' },
  ];

  const cene = {
    '30g': 250,
    '50g': 400,
  };

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
      setStatus('Molimo unesite sve podatke: ime i prezime, telefon i email.');
      return;
    }

    const templateParams = {
      order_id: Math.floor(Math.random() * 100000),
      imeprezime: imeprezime.trim(),
      telefon: telefon.trim(),
      email: email.trim(),
      orders: porudzbina.map(p => `${p.ime} (${p.gramaza}) - ${p.cena} RSD`).join('\n'),
      price: porudzbina.reduce((acc, item) => acc + item.cena, 0)
    };

    emailjs.send(
      'service_nw0o8sd',        // <-- TVOJ SERVICE ID
      'template_2a2f5sr',       // <-- TVOJ TEMPLATE ID
      templateParams,
      'OZIzXvYjWtayN02p1'       // <-- TVOJ USER (PUBLIC) KEY
    )
      .then(() => {
        setStatus('Narudžbina je uspešno poslata!');
        setPorudzbina([]);
        setImePrezime('');
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
      <header className="mb-8 text-center">
        <img
          src="/logo.jpg"
          alt="Stellagreens logo"
          className="mx-auto w-60 h-auto mb-2"
        />
        <p className="text-sm text-green-600">Sveže mikrobilje iz lokalne proizvodnje</p>
      </header>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Naša ponuda</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {proizvodi.map((p, i) => (
            <div key={i} className="border border-green-100 rounded-2xl bg-white shadow p-4">
              <img
                src={`/images/${p.slika}`}
                alt={p.ime}
                className="w-full h-32 object-cover rounded-xl mb-2"
              />
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
              <p className={`text-xs mt-1 ${p.status === 'Dostupno' ? 'text-green-600' : (p.status === 'Uskoro dostupno' ? 'text-yellow-600' : 'text-red-500')}`}>
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

      <section className="mt-10 max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold mb-3">🛒 Tvoja narudžbina</h2>
        {porudzbina.length === 0 ? (
          <p className="text-sm italic">Još uvek nema dodatih proizvoda.</p>
        ) : (
          <ul className="list-disc pl-4 space-y-1">
            {porudzbina.map((item, i) => (
              <li key={i} className="flex items-center justify-between">
                <span>{item.ime} - {item.gramaza} - {item.cena} RSD</span>
                <button
                  onClick={() => ukloniProizvod(i)}
                  className="text-red-600 text-xs hover:underline"
                >
                  Ukloni proizvod
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6">
          <label htmlFor="imeprezime" className="block mb-1 font-medium">Ime i prezime:</label>
          <input
            id="imeprezime"
            type="text"
            value={imeprezime}
            onChange={e => setImePrezime(e.target.value)}
            className="w-full p-2 border border-green-400 rounded mb-2"
            placeholder="Ime i prezime"
          />
          <label htmlFor="telefon" className="block mb-1 font-medium">Telefon:</label>
          <input
            id="telefon"
            type="text"
            value={telefon}
            onChange={e => setTelefon(e.target.value)}
            className="w-full p-2 border border-green-400 rounded mb-2"
            placeholder="060 1234567"
          />
          <label htmlFor="email" className="block mb-1 font-medium">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 border border-green-400 rounded"
            placeholder="primer@domen.com"
          />
        </div>

        {porudzbina.length > 0 && (
          <div className="text-center mt-4">
            <button
              onClick={posaljiNarudzbinu}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full shadow"
            >
              Pošalji narudžbinu
            </button>
            {status && <p className="mt-2 text-sm text-green-800">{status}</p>}
          </div>
        )}
      </section>
    </div>
  );
}
