
const gal = [
  {
    "id": 1,
    "filename": "/media/gal/anime.JPG",
    "title": "Anime"
  },
  {
    "id": 2,
    "filename": "/media/gal/anime2.JPG",
    "title": "Anime 2"
  },
  {
    "id": 3,
    "filename": "/media/gal/blackSpider.JPG",
    "title": "Black Spider"
  },
  {
    "id": 4,
    "filename": "/media/gal/car.JPG",
    "title": "Car"
  },
  {
    "id": 5,
    "filename": "/media/gal/cat.JPG",
    "title": "Cat"
  },
  {
    "id": 6,
    "filename": "/media/gal/gameOver.JPG",
    "title": "Game Over"
  },
  {
    "id": 7,
    "filename": "/media/gal/penHolder.JPG",
    "title": "Pen Holder"
  },
  {
    "id": 8,
    "filename": "/media/gal/trofy.JPG",
    "title": "Trofy"
  },
  {
    "id": 9,
    "filename": "/media/gal/hot.JPG",
    "title": "Hot"
  }
]
import Image from 'next/image';
export default function GalleryStrip() {
  return (
    <section className="bg-dark py-10 overflow-hidden">
      <div className="flex gap-4 px-4 animate-gallery">
        {gal.map((item) => (
          <Image key={item.id} src={item.filename} alt={item.title} width={200} height={200} className="w-[200px] h-[200px] object-cover rounded-sm"
          style={{ width: 'auto', height: 'auto' }} />
        ))}
      </div>
    </section>
  );
}
