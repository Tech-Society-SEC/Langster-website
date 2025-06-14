import { useParams } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '../styles/History.css';
import engbghis from '../assets/history/engbghis.jpg';
import frenchbghis from '../assets/history/frenchbghis.jpg';
import tamilbghis from '../assets/history/tamilbghis.jpg';
import telubghis from '../assets/history/telubghis.jpg';


const languageData = {
  french: {
    title: 'French Language',
    origin: 'The origins of the French language are intertwined with the history of France itself. As noted above, French is a mix of different languages. Latin, brought to the region by the Roman Empire, laid the foundation for the language.',
    evolution: 'Transformed through Old & Middle French.\nOld French originates from around the late 8th century. Gaul had been subject to invasions from Germanic tribes from the north and east, some of whom remained and settled there.\nThe Middle French period covers the 14th to the end of 16th centuries. It was in this period that French developed the features and characteristics that made it similar to modern French. (In contrast, French speakers today would find it difficult to read an Old French text.)',
    geography: 'Spoken in numerous countries across Europe, Africa, the Americas, and even parts of Asia.',
    usage: '300M speakers, UN & EU official language…',
    books: [
      '“Easy French Step-by-Step” by Myrna Bell Rochester',
      '“French Grammar and Usage” by Roger Hawkins',
      '“Practice Makes Perfect: French Verb Tenses”',
    ],
  },
  english: {
    title: 'English Language',
    origin: 'English began as a West Germanic language brought to Britain by Anglo-Saxon settlers in the 5th–7th centuries AD. It replaced earlier Celtic and Latin languages spoken in the region. Old English was shaped by influences from Norse-speaking Vikings. Its roots are mainly Germanic with some early Latin borrowings.',
    evolution: 'English evolved from Old English to Middle English after the Norman Conquest (1066), which introduced many French words. Grammar simplified and vocabulary expanded over time. The Renaissance and printing press brought more Latin and Greek words, leading to Early Modern English. Modern English developed with global influence through colonization and technology.',
    geography: 'English is a native language in countries like the UK, US, Canada, Australia, and New Zealand. It is an official or second language in many nations, including India, Nigeria, and South Africa. English is widely taught and used as a foreign language worldwide. Today, it is the global lingua franca for business, science, and international communication.',
    usage: '1.5B speakers; global lingua franca…',
    books: [
      '“English Grammar in Use” by Raymond Murphy',
      '“Word Power Made Easy” by Norman Lewis',
      '“The Elements of Style” by Strunk & White',
    ],
  },
  telugu: {
    title: 'Telugu Language',
    origin: 'Telugu is a Dravidian language that originated around 1000 BCE in southern India, mainly in present-day Andhra Pradesh and Telangana. Its earliest inscriptions date back to around 200 BCE, evolving from Proto-Dravidian roots.',
    evolution: 'Telugu developed through Old, Middle, and Modern stages, heavily influenced by Sanskrit and regional dynasties. It gained prominence as a literary language during the medieval period under the Cholas and Vijayanagara Empire.',
    geography: 'Telugu is primarily spoken in Andhra Pradesh and Telangana and by communities in neighboring Indian states. It has a significant diaspora in countries like the US, Malaysia, and the Middle East. It is the third most spoken language in India and continues to expand globally.',
    usage: 'One of India’s six classical languages…',
    books: [
      '“Learn Telugu in 30 Days” by N.S. Raghavan',
      '“Basic Telugu Reader” by T. Ramachandra Sharma',
      '“Telugu Grammar & Composition” by N. K. Sharma',
    ],
  },
  tamil: {
    title: 'Tamil Language',
    origin: 'Tamil, one of the world’s oldest classical languages, originated from the Dravidian family and boasts written records dating back to at least the 3rd century BCE.',
    evolution: 'It evolved through Old, Middle, and Modern Tamil, with rich literary traditions like Sangam poetry and major developments during the Bhakti movement.',
    geography: 'Tamil is primarily spoken in Tamil Nadu (India) and northern Sri Lanka, with vibrant diaspora communities in Malaysia, Singapore, Canada, the UK, and beyond.',
    usage: 'Official in Tamil Nadu; rich film & literary tradition…',
    books: [
      '“Tamil for Beginners” by S. Swaminathan',
      '“Colloquial Tamil” by Annamalai & Asher',
      '“Urundaiyin Mozhigal” by M. Ramachandran',
    ],
  },
};

const backgroundMap = {
  english: engbghis,
  french: frenchbghis,
  tamil: tamilbghis,
  telugu: telubghis,
};

export default function History() {
  const { langKey } = useParams();
  const lang = languageData[langKey];
  const backgroundImage = backgroundMap[langKey];


  if (!lang) {
    return <p>Sorry, we couldn’t find that language.</p>;
  }

  return (
    <div className="history-container">
      <section
        className="language-section"
        style={{
      backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
      }}

      >
        <h2>{lang.title}</h2>

        <div className="sub-section">
          <h3>Origin</h3>
          <p>{lang.origin}</p>
        </div>
        <div className="sub-section">
          <h3>Evolution</h3>
          <p>{lang.evolution}</p>
        </div>
        <div className="sub-section">
          <h3>Geographical Presence</h3>
          <p>{lang.geography}</p>
        </div>
        <div className="sub-section">
          <h3>Current Usage</h3>
          <p>{lang.usage}</p>
        </div>
        <div className="sub-section">
          <h3>Recommended Books</h3>
          <div className="carousel-wrapper">
            <Carousel
              showThumbs={false}
              showStatus={false}
              showIndicators={true}
              swipeable={true}
              emulateTouch={true}
              infiniteLoop={true}
              autoPlay={true}
              interval={1000}
            >
              {lang.books.map((title, i) => (
                <div key={i} className="book-slide">
                  <p>{title}</p>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </section>
    </div>
  );
}