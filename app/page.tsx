import AudioPlayer from "@/components/AudioPlayer";
import HowlerPlayer from "@/components/Howler";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-10 p-10">
      <HowlerPlayer />
      <AudioPlayer/>
    </main>
  );
}
