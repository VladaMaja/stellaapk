import emailjs from '@emailjs/browser';
import { useState } from 'react';

export default function App() {
  const [porudzbina, setPorudzbina] = useState([]);
  const [status, setStatus] = useState('');
  const [email, setEmail] = useState('');

  const proizvodi = [
    { ime: 'Brokoli', cena: 150, status: 'Dostupno', slika: 'brokoli.jpg' },
    { ime: 'Bosiljak', cena: 130, status: 'Nije dostupno', slika: 'bosiljak.jpg' },
    { ime: 'Cvekla', cena: 140, status: 'Dostupno', slika: 'cvekla.jpg' },
    { ime: 'Kineska rotkvica', cena: 120, status: 'Dostupno', slika: 'kineska_rotkvica.jpg' },
    { ime: 'Rukola', cena: 150, status: 'Nije dostupno', slika: 'rukola.jpg' },
    { ime: 'Lan', cena: 110, status: 'Dostupno', slika: 'lan.jpg' },
    { ime: 'Vlasac', cena: 130, status: 'Dostupno', slika: 'vlasac.jpg' },
    { ime: 'Grašak', cena: 140, status: 'Nije dostupno', slika: 'grasak.jpg' },
    { ime: 'Lucerka', cena: 120, status: 'Dostupno', slika: 'lucerka.jpg' },
    { ime: 'Šargarepa', cena: 150, status: 'Dostupno', slika: 'sargarepa.jpg' },
    { ime: 'Korijander', cena: 130, status: 'Dostupno', slika: 'korijander.jpg' },
    { ime: 'Slačica', cena: 110, status: 'Dostupno', slika: 'slacica.jpg' },
  ];

  const dodajUkorpu = (proizvod) => {
    setPorudzbina([...porudzbina, proizvod]);
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
    if (!email.trim()) {
      setStatus('Molimo unesite vašu email adresu.');
      return;
    }

    const orders = porudzbina.map(p => ({
      name: p.ime,
      units: 1,
      price: p.cena,
    }));

    const totalPrice = orders.reduce((acc, item) => acc + item.price, 0);

    const templateParams = {
      order_id: Math.floor(Math.random() * 100000),
      orders: orders,
      price: totalPrice,
      email: email.trim()
    };

    emailjs.send('service_nw0o8sd', 'template_2a2f5sr', templateParams, 'OZIzXvYjWtayN02p1')
      .then(() => {
        setStatus('Narudžbina je uspešno poslata!');
        setPorudzbina([]);
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
                src={`/images/{p.slika}`}
                alt={p.ime}
                className="w-full h-32 object-cover rounded-xl mb-2"
              />
              <h3 className="text-lg font-bold mb-1">{p.ime}</h3>
              <p className="text-sm">{p.cena} RSD</p>
              <p className={`text-xs mt-1 {p.status === 'Dostupno' ? 'text-green-600' : 'text-red-500'}`}>
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
                <span>{item.ime} - {item.cena} RSD</span>
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
          <label htmlFor="email" className="block mb-1 font-medium">Unesite vaš email:</label>
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