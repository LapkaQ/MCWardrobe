import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AlertSkin from "./components/AlertSkin";

export default function MinecraftSkinClothes() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [clothes, setClothes] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState(null);
  const [skinUrl, setSkinUrl] = useState(null);
  const [errorMessages, setErrorMessages] = useState({});
  const canvasRef = useRef(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;
    try {
      const response = await fetch(`${backendUrl}/skins_url/${username}`, {
        headers: {
          "X-API-Key": import.meta.env.VITE_APP_API_KEY,
        },
      });
      if (!response.ok) {
        if (response.status === 404) {
          setErrorMessages({
            ...errorMessages,
            skin: "User not found",
          });
        } else {
          throw new Error("Failed to fetch skin");
        }
        return;
      }

      const data = await response.json();
      setSkinUrl(data.skin_url);
      setUser(data);
      setErrorMessages({ ...errorMessages, skin: null });
    } catch (error) {
      setErrorMessages({
        ...errorMessages,
        skin: "An error occurred while fetching the skin",
      });
    }
  };

  useEffect(() => {
    const fetchClothes = async () => {
      const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;
      try {
        const response = await fetch(`${backendUrl}/skins`, {
          headers: {
            "X-API-Key": import.meta.env.VITE_APP_API_KEY,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch skins");

        const clothesData = await response.json();
        setClothes(clothesData);
      } catch (error) {
        setErrorMessages({
          ...errorMessages,
          clothes: "An error occurred while fetching skins",
        });
      }
    };

    fetchClothes();
  }, []);

  const handleChangeSkin = async (item) => {
    const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;
    const payload = {
      image_url: user.skin_url,
      image_base64: item.skin,
      model: user.model,
    };
    try {
      const response = await fetch(`${backendUrl}/connect_skins/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": import.meta.env.VITE_APP_API_KEY,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const resultData = await response.json();
      setResult({ ...resultData, skinName: item.name });
      setIsOpen(true);
    } catch (error) {
      setErrorMessages({
        ...errorMessages,
        skinChange: "An error occurred while changing the skin",
      });
    }
  };

  const handleDownload = (result) => {
    if (result && result.image) {
      const link = document.createElement("a");
      link.href = `data:image/png;base64,${result.image}`;
      link.download = `${user.profile_name}_${result.skinName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center">MCWardrobe</h1>
      <h4 className="text-xl font-medium mb-6 text-center">
        {" "}
        Minecraft Skin Clothes
      </h4>
      <form onSubmit={handleSearch} className="mb-6 flex gap-4 justify-center">
        <Input
          type="text"
          placeholder="Your Minecraft nickname"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="max-w-xs"
        />
        <Button type="submit">Search</Button>
      </form>
      {errorMessages.skin && (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-[1fr_3fr_1fr] lg:grid-cols-[1fr_2fr_1fr] xl:grid-cols-[1fr_1fr_1fr] gap-1">
          <div></div>
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessages.skin}</AlertDescription>
          </Alert>
        </div>
      )}
      {user && (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-[1fr_3fr_1fr] xl:grid-cols-[1fr_3fr_1fr] gap-1">
          <div></div>
          <Card>
            <CardContent className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-[1fr_1fr_2fr] xl:grid-cols-[1fr_1fr_2fr] gap-1 p-2 sm:p-3 md:p-4 lg:p-5 xl:p-5">
              <div className="flex justify-center items-center">
                <img
                  src={user.skin_body.front}
                  className="w-1/2 sm:w-3/5 md:w-1/2 lg:w-full xl:w-1/2 object-cover rounded"
                />
              </div>
              <div className="flex justify-center items-center">
                <img
                  src={user.skin_body.back}
                  className="w-1/2 sm:w-3/5 md:w-1/2 lg:w-full xl:w-1/2 object-cover rounded"
                />
              </div>
              <div className="flex flex-col justify-center items-center md:items-start col-span-2 lg:col-span-1 p-2 sm:p-3 md:p-3 lg:p-3 xl:p-3">
                <p className="font-medium text-sm sm:text-base">
                  Name: {user.profile_name}
                </p>
                <div className="flex items-center gap-1">
                  <p className="font-medium text-sm sm:text-base">UUID:</p>
                  <p className="font-medium text-sm sm:text-base">
                    {user.uuid}
                  </p>
                </div>
                <p className="font-medium text-sm sm:text-base">
                  Type: {user.model}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      {clothes.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Available Clothes:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {clothes.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-2 grid grid-cols-2">
                  <p className="text-center font-medium col-span-2 p-1">
                    {item.name}
                  </p>
                  <div className="flex justify-center items-center">
                    <img
                      src={`data:image/png;base64,${item.skin}`}
                      alt={item.name}
                      className="w-full object-cover mb-2 rounded pixelated"
                    />
                  </div>
                  <div className="flex justify-center items-center">
                    <img
                      src={`data:image/png;base64,${item.render}`}
                      alt={item.name}
                      className="w-1/2 object-cover mb-2 rounded pixelated"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="col-span-2 m-2"
                    onClick={() => handleChangeSkin(item)}
                    disabled={!user}
                  >
                    Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      <AlertSkin
        open={isOpen}
        setOpen={setIsOpen}
        skinUrl={skinUrl}
        result={result}
        handleDownload={handleDownload}
      />
    </div>
  );
}
