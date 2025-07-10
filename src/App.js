import emailjs from '@emailjs/browser';
import { useState } from 'react';

export default function App() {
  const [porudzbina, setPorudzbina] = useState([]);
  const [status, setStatus] = useState('');
  const [email, setEmail] = useState('');
  const [prikaziInfo, setPrikaziInfo] = useState(null);

  // Dodaj ili izmeni status: 'Dostupno', 'Nije dostupno', 'Uskoro'
  const proizvodi = [
    {
      ime: 'Brokoli',
      status: 'Dostupno',
      slika: 'brokoli.jpg',
      info: `• Bogat vitaminima C, K, A i antioksidansima\n• Jača imunitet, podržava detoksikaciju\n• Preporučuje se svima, uz oprez kod osoba na antikoagulantima`
    },
    {
      ime: 'Bosiljak',
      status: 'Uskoro',
      slika: 'bosiljak.jpg',
      info: `• Sadrži vitamine K, A, magnezijum\n• Dobar za varenje, smanjuje upale\n• Ne preporučuje se osobama alergičnim na bosiljak`
    },
    {
      ime: 'Cvekla',
      status: 'Nije dostupno',
      slika: 'cvekla.jpg',
      info: `• Izvor folata, gvožđa, betaina\n• Poboljšava cirkulaciju i podržava jetru\n• Oprez kod bubrežnih bolesnika (oksalati)`
    },
    {
      ime: 'Kineska rotkvica',
      status: 'Dostupno',
      slika: 'kineska rotkvica.jpg',
      info: `• Puna vitamina C i sumpornih jedinjenja\n• Podstiče probavu i čisti organizam\n• Ne preporučuje se kod problema sa štitnom žlezdom`
    },
    {
      ime: 'Rukola',
      status: 'Dostupno',
      slika: 'rukola.jpg',
      info: `• Izuzetno bogata vitaminima K, C\n• Pomaže varenje, sadrži gorke materije korisne za jetru\n• Može izazvati tegobe kod osoba sa osetljivim želucem`
    },
    {
      ime: 'Lan',
      status: 'Dostupno',
      slika: 'lan.jpg',
      info: `• Bogat omega-3 masnim kiselinama i vlaknima\n• Podržava rad srca i varenja\n• Oprez kod osoba sa zapaljenskim bolestima creva`
    },
    {
      ime: 'Vlašac',
      status: 'Uskoro',
      slika: 'vlašac.jpg',
      info: `• Bogat vitaminom K i folatima\n• Dobar za kosti i krvne sudove\n• Oprez kod osoba alergičnih na lukovice`
    },
    {
      ime: 'Grašak',
      status: 'Dostupno',
      slika: 'grašak.jpg',
      info: `• Izvor proteina, vitamina B, C, E\n• Pomaže oporavak mišića i radu creva\n• Oprez kod osoba sklonih stvaranju gasova`
    },
    {
      ime: 'Lucerka',
      status: 'Dostupno',
      slika: 'lucerka.jpg',
      info: `• Sadrži vitamine K, C, E, minerale\n• Jača imunitet i smanjuje umor\n• Nije preporučljiva trudnicama zbog fitoestrogena`
    },
    {
      ime: 'Šargarepa',
      status: 'Dostupno',
      slika: 'šargarepa.jpg',
      info: `• Puna beta-karotena, vitamina A\n• Dobro za vid i kožu\n• Oprez kod dijabetičara zbog šećera`
    },
    {
      ime: 'Korijander',
      status: 'Dostupno',
      slika: 'korijander.jpg',
      info: `• Bogat antioksidansima i vitaminom K\n• Podržava varenje i detoksikaciju\n• Oprez kod osoba alergičnih na peršun i slične biljke`
    },
    {
      ime: 'Slačica',
      status: 'Dostupno',
      slika: 'slačica.jpg',
      info: `• Sadrži vitamine A, C, E i minerale\n• Potiče cirkulaciju i probavu\n• Oprez kod čira na želucu`
    }
  ];

  const [odabranaGramaza, setOdabranaGramaza] = useState({});
  const cene = { '30g': 250, '50g': 400 };

  const dodajUkorpu = (proizvod) => {
    const gramaza = odabranaGramaza[proizvod.ime] || '30g';
    setPorudzbina([...porudzbina, { ...proizvod, gramaza, cena: cene[gramaza] }]);
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
      gramaza: p.gramaza,
      price: p.cena,
    }));
    const totalPrice = orders.reduce((acc, item) => acc + item.price, 0);
    const templateParams = {
      order_id: Math.floor(Math.random() * 100000),
      orders: orders.map(o => `${o.name} (${o.gramaza}) - ${o.price} RSD`).join('\n'),
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
              <p className={`text-xs mt-1 ${
                p.status === 'Dostupno'
                  ? 'text-green-600'
                  : p.status === 'Uskoro'
                  ? 'text-yellow-600'
                  : 'text-red-500'
              }`}>
                {p.status === 'Uskoro' ? 'Uskoro u ponudi' : p.status}
              </p>
              <button
                onClick={() => setPrikaziInfo(i)}
                className="mt-2 text-sm bg-green-100 hover:bg-green-200 px-2 py-1 rounded"
              >
                Više info
              </button>
              <button
                onClick={() => dodajUkorpu(p)}
                className={`mt-3 text-sm px-3 py-1 rounded-xl 
                  ${p.status === 'Dostupno'
                    ? 'bg-green-200 hover:bg-green-300 text-green-900'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                `}
                disabled={p.status !== 'Dostupno'}
              >
                {p.status === 'Uskoro'
                  ? 'Nedostupno'
                  : p.status === 'Nije dostupno'
                  ? 'Nedostupno'
                  : 'Dodaj u narudžbinu'}
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

      {/* Modal za više info */}
      {prikaziInfo !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md shadow-lg text-green-900 relative">
            <h3 className="text-xl font-bold mb-2">
              {proizvodi[prikaziInfo].ime}
            </h3>
            <p className="mb-4 whitespace-pre-line">{proizvodi[prikaziInfo].info}</p>
            <button
              onClick={() => setPrikaziInfo(null)}
              className="absolute top-2 right-2 bg-green-200 hover:bg-green-300 px-3 py-1 rounded"
            >
              Zatvori
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
