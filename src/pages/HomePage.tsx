import { Link } from 'react-router-dom'
import { Search, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-700 flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 mb-8 shadow-md">
          <Search className="text-white" size={28} />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
          Podo kayboldu.
        </h1>

        <p className="text-lg text-gray-500 mb-8">
          Sana ihtiyacı var, dedektif.
        </p>

        <p className="text-gray-600 leading-relaxed mb-12">
          İzmir sokaklarında 5 farklı kaynaktan toplanmış ipuçları var:
          <br />
          giriş kayıtları, mesajlar, görülmeler, kişisel notlar ve anonim ihbarlar.
          <br />
          Onu bulmak için bu bilgilerin arasındaki bağlantıları çözmen gerekiyor.
        </p>

        <Link
          to="/checkins"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-sm"
        >
          Elimizdeki bilgilere bak
          <ArrowRight size={18} />
        </Link>

        <p className="text-xs text-gray-400 mt-8">5 veri kaynağı · İzmir</p>
      </div>
    </div>
  )
}
