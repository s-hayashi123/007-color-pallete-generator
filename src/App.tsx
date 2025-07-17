import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { Button } from "./components/ui/button";
import chroma from "chroma-js";

// TODO: ランダムな16進数のカラーコード（例: "#1a2b3c"）を文字列として返す `generateRandomHexColor` という関数を作成してください。
// ヒント: `Math.random()` と `toString(16)` を組み合わせます。
// `padStart(6, '0')` を使うと、6桁に満たない場合に0で埋めることができ便利です。

const generateRandomHexColor = () => {
  const color = Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0");
  return "#" + color;
};

function App() {
  const [colors, setColors] = useState<string[]>([]);
  // TODO: `generatePalette` という名前の関数を `useCallback` を使って定義しましょう。
  // --- 関数の思考プロセス ---
  // 1. 新しい色の配列を格納するための `newColors` という変数を準備します。
  // 2. forループなどを使って5回繰り返し、`generateRandomHexColor` を呼び出して `newColors` に追加します。
  // 3. ループが終わったら、`setColors` を使って `colors` stateを `newColors` で更新します。

  const generatePalette = useCallback(() => {
    const newColors: string[] = [];
    for (let i = 0; i < 5; i++) {
      newColors.push(generateRandomHexColor());
    }
    setColors(newColors);
  }, []);

  // TODO: `useEffect` を使って、以下の2つの副作用を実装してください。
  // 1. コンポーネントが最初にマウントされたときに一度だけ `generatePalette` を呼び出す。
  // 2. スペースキーが押された(`keydown`イベント)ときに `generatePalette` を呼び出す。
  //
  // --- 思考のヒント ---
  // - 2つ目の副作用では、イベントリスナーを登録する必要があります。
  // - `useEffect` のクリーンアップ関数で、登録したイベントリスナーを必ず解除するのを忘れないようにしましょう。これはメモリリークを防ぐために非常に重要です。

  useEffect(() => {
    generatePalette();
  }, [generatePalette]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        generatePalette();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [generatePalette]);

  // TODO: `handleCopy` という名前の非同期関数を定義しましょう。
  // この関数は引数として `color: string` を受け取ります。
  // `navigator.clipboard.writeText(color)` を使って、受け取ったカラーコードをクリップボードに書き込みます。
  // 成功したことがわかるように、`alert("Copied!")` などを実行してみましょう。

  // TODO: Step 4で作成した `map` の中の `div` 要素に `onClick` イベントを追加し、この `handleCopy` 関数を呼び出すようにしてください。

  const handleCopy = async (color: string) => {
    await navigator.clipboard.writeText(color);
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, 2000);
  };

  const [isToastVisible, setIsToastVisible] = useState<boolean>(false);

  const isLight = (color: string) => chroma(color).luminance() > 0.5;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center gap-8 p-4">
      <div className="flex sm:flex-row flex-col justify-center gap-4">
        {
          // TODO: `colors` 配列を `map` メソッドでループ処理してください。
          // 各 `color` に対して、背景色がその色になるような `div` 要素を返します。
          // `div` の中には、カラーコードの文字列を表示しましょう。
          // 例: <div style={{ backgroundColor: color }} className="...">{color}</div>
          // key属性を忘れないように！
          colors.map((color) => (
            <div
              style={{
                backgroundColor: color,
                color: isLight(color) ? "#000" : "#fff",
              }}
              className="rounded-lg shadow-md p-4 text-center cursor-pointer transition-transform hover:scale-105 min-w-[100px]"
              key={color}
              onClick={() => handleCopy(color)}
            >
              {color}
            </div>
          ))
        }
      </div>
      <Button onClick={generatePalette}>Generate Palette</Button>
      {isToastVisible && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-gray-700 text-white px-4 py-2 rounded shadow">
          Copied!
        </div>
      )}
    </div>
  );
}

export default App;
