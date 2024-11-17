import MapLayout from "./_components/MapLayout";
import SideBar from "./_components/SideBar";

export default function Home() {
  return (
    <div className="flex h-screen">
      <MapLayout />
      <SideBar />
    </div>
  );
}
