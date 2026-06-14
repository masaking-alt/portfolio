# 右・下側に余白が残る原因と対策

## 現象
`displayMode === 'app'` の状態で、画面右端・下端に**絶対位置の枠**（AppWindow）が描画されます。

```
position: absolute;
right: 0; bottom: 0;
width: …px; height: …px;
```

というスタイルで配置されていますが、ウィンドウサイズに対して固定幅／高さを使っているため
右・下側に余白（空白）が残ることがあります。

## 原因 1 – 固定サイズの枠
`src/utils/windowFrames.js` の `appLarge` で `width: 1180`, `height: 760` を使っているため、画面がそれより小さい場合に余白が発生します。逆に画面が大きいときは枠が画面端まで到達せず、下側・右側に透明領域が残ります。

## 原因 2 – 親要素のスタイル
`WorkspaceScreen.jsx` の `desktop-window-reveal` が `relative`、また `overflow-hidden` を持つため、枠が親からはみ出た部分だけが表示されます。左上に余白がない状態でも、下・右端は親の境界を越えて描画されるので透明背景が見えることがあります。

## 原因 3 – `clampWindowFrame` の計算
`windowFrames.js` で `clampWindowFrame()` が呼ばれる際に、`containerWidth`・`containerHeight` をそのまま渡しているため、実際のビューポートサイズを考慮した値になっていない可能性があります。

## 対策
1. **枠サイズを相対化**：
   ```js
   width: containerWidth - 48;      // 画面幅からマージンだけ引く
   height: containerHeight - 48;    // 同上
   ```
2. **親要素のパディングを調整**：`desktop-window-reveal` の `lg:p-0` を外し、必要に応じて余白を与える。
3. **位置指定を `left/top: 0` に変更**：枠が画面左上から始まるようにして、右・下側の余白を防ぐ。

これらを組み合わせることで、**AppWindow がウィンドウ全体にフィットし、不要な余白が消える**ことが期待できます。 

---

※ 本ドキュメントは、現状のコードベースと見つかった原因をまとめたものであり、実際に変更する前にコードレビューやテストを行うことを推奨します。
