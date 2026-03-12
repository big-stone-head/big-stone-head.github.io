---
layout: post
title: "3つのAIコーディングアシスタントに「合同診察」させたら、それぞれの\"人格\"が見えてきた"
date: 2026-02-12
lang: ja
lang_pair: "/2026/02/12/ai-coding-agents-battle-royale/"
---
## 本文


### はじめに：予定外の「武闘大会」

事の発端は単純だった——金欠になったのだ。

正確に言えば、Tokenが尽きた。最近、Claude CodeのAgent Teamモードでコードを書いていたのだが、5つのAgentが同時稼働するとTokenの消費が正月の花火みたいで、パチパチ景気よく弾けたと思ったらもう財布が空っぽ。さらに腹が立つことに、Tokenを使い切るとレート制限がかかって、ゲームのオーバーヒートみたいにクールダウンを待つしかない。

暇を持て余してClaudeの師匠が「解熱」するのを待っていたところ、Kimiが最近CLI版を出してコーディングに対応したらしい、しかも価格がかなり良心的だという噂を耳にした。思い立ったが吉日、すぐに購入した。

もともとベンチマークなんてやるつもりはなかった。考えてみてほしい——普通、3人の医者に同時に同じ患者を診せたりしないだろう？まともな人間はしない。

ところが運悪く、手元に2つのプロジェクトがあって、どちらもちょっとした「難病」を抱えていた。自分でもなんとなく原因の見当はつくが、100%の確信は持てない。新入りのKimi君に任せるのは心もとないし、Claudeの師匠に頼んだところで確実に解決できる保証もない。

さて、どうする？

昔は「華山論剣」、今は「AI合同診察」。いっそのこと、同じバグを各選手にそれぞれ診断させて、互いの結果を突き合わせてみよう。ついでに各々の「医術」と「性格」も見えてくるだろう。

こうして、予定外のAIコーディングアシスタント「武闘大会」が幕を開けた。

---


### 第1ラウンド：メモリリークが引き起こした「三国志」

**事件現場**

まず案件の説明から。

Next.jsのプロジェクトがあって、フロントエンドに最近motionアニメーションのコンポーネントライブラリと新しいアイコンライブラリを追加した。追加した途端、開発環境でプロジェクトがどんどん重くなっていった。ページを数回切り替えるとブラウザが息切れし始め、さらに何回か切り替えると完全にフリーズする。典型的なメモリリークの症状だ。

おおよその原因は見当がついていた——おそらく新しく導入したライブラリ絡みで、コンポーネントの参照方法に罠があるのだろう。とはいえ推測は推測であって、自分の思い過ごしかもしれない。この手のバグの厄介なところは、「ここが間違ってるよ」と面と向かって教えてくれないこと。ただ黙々とメモリを食い続けて、こちらが崩壊するまで止まらない。

そこで、まず問題を再現してサーバーサイドのログを取得した。どのURLにPOST/GETが飛んでいるか、データ取得に何ミリ秒、ページレンダリングに何ミリ秒かかっているか——こうした基本的な「検査報告書」を用意して、各「医師」にそれぞれ渡すことにした。

**Kimi選手：天才少年、とにかく速い**

最初に診察したのはKimi選手。

ログを貼り付けて症状を説明した——「ページを何回か切り替えるとフリーズします」。Kimiはログに目を通し、少し考え（本当に一瞬だけ考え）、対応するソースファイルをいくつか確認すると、パッと診断結果を出してきた。

「ここが問題です。このコンポーネントがレンダリングのたびにインスタンスを再生成していて、クリーンアップ処理がありません」

その速さといったら、テレビドラマに出てくる天才少年を彷彿とさせる。患者がまだ症状を言い終わらないうちに、もう処方箋ができている。

私の反応は：うん、筋は通っている。でも……ちょっと見るの速すぎない？もう何ファイルか確認しなくていいの？

Kimiの答え：いえ、これで間違いないです。

まあいい、とりあえずこの回答をメモしておこう。

**Codex選手：アカデミック派の老教授、全部読まないと口を開かない**

次はCodex君の番だ。（ここで言うのはOpenAIのCodex CLIのこと。）

同じログ、同じ問題の説明。Codexの反応はKimiとはまるで違った——長い長い「読書マラソン」が始まったのだ。

大げさではなく、前後合わせて20分以上はかかった。私が指摘した数ファイルだけでなく、プロジェクトのファイルをほぼ全部読み通した。`package.json`を読み、`next.config.js`を読み、各種コンポーネントファイルを読み、データ層のコードも読み、テストファイルすら見逃さなかった。

その様はまるで、論文を受け取った老教授が参考文献をすべて読み終えるまで絶対にコメントしない、あの姿勢そのものだった。

20分余りの後、Codexはようやく結論を出した——Kimiとはまったく違う。Codexが指摘したのはデータ層の問題で、データリーク方面の見解だった（申し訳ないが正確な言い回しは少し忘れた。ただ、核心的な方向性がKimiとは確実に異なっていた）。

2人の医師、1人の患者、まったく別の診断。

面白くなってきた。

**名場面：「これは別の大先生の見解です」**

次にやったのは、ちょっと意地悪かもしれないことだ。

Codexの回答をKimiに送って、「これは別の大先生の見解です。どう思いますか？」と聞いた。

同時に、Kimiの回答をCodexにも送って、同じセリフを添えた。

そして、見事な一幕が展開された。

Kimiの反応——即答：「彼の言う通りです！改めて分析し直しましたが、確かにデータ層の問題です」

味わってほしい。一秒前まで「コンポーネントの問題です」と自信満々だったのに、次の秒には他人の回答を見て即座に「寝返った」のだ。この潔すぎる変わり身に、笑うべきか泣くべきか分からなかった。「信念なき速さ」とは、まさにこのことだ。

一方、Codexの反応——同じ状況で、まるで違う態度：「彼の見解を分析しましたが、私は彼の判断が十分に正確だとは考えません。プロジェクト全体のコードを網羅的に読んだ上で、私は自分の結論を堅持します」

さすが20分かけてコードを読んだ人間だ。君には君の結論がある、私には私の信念がある。根拠を持って一歩も引かない。

この一幕は、まるで職場のコントだった——

Kimiは会議で真っ先に手を挙げて発言するが、上司が「ちょっと違うんじゃない？」と言った瞬間にすぐ意見を翻す若手社員。

Codexは普段寡黙だが、いざ口を開くとデータの束を出してきて、誰が何を言おうとテコでも動かないベテランアナリスト。

<div class="html-image">
<div style="max-width: 900px; margin: 0 auto; padding: 0; font-family: -apple-system, 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif;">
  <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.4);">
    <div style="padding: 32px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
      <div style="font-size: 28px; font-weight: 800; color: #fff; letter-spacing: 2px;">クロスバリデーション名場面</div>
      <div style="font-size: 16px; color: rgba(255,255,255,0.6); margin-top: 8px;">「これは別の大先生の見解です。どう思いますか？」</div>
    </div>
    <div style="display: flex; gap: 0;">
      <div style="flex: 1; padding: 32px; border-right: 1px solid rgba(255,255,255,0.1);">
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="display: inline-block; width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, #00d2ff, #3a7bd5); line-height: 64px; font-size: 28px;">K</div>
        </div>
        <div style="font-size: 22px; font-weight: 700; color: #00d2ff; text-align: center; margin-bottom: 16px;">Kimi 選手</div>
        <div style="background: rgba(0,210,255,0.1); border-radius: 12px; padding: 20px; margin-bottom: 16px;">
          <div style="font-size: 15px; color: rgba(255,255,255,0.9); line-height: 1.8;">Codexの結論を見た後：</div>
          <div style="font-size: 20px; font-weight: 700; color: #00d2ff; margin-top: 12px; line-height: 1.4;">「彼の言う通りです！改めて分析した結果、データ層の問題ですね」</div>
        </div>
        <div style="text-align: center; padding: 12px; background: rgba(255,107,107,0.15); border-radius: 8px;">
          <span style="font-size: 14px; color: #ff6b6b; font-weight: 600;">即・寝返り</span>
        </div>
      </div>
      <div style="flex: 1; padding: 32px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="display: inline-block; width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, #11998e, #38ef7d); line-height: 64px; font-size: 28px;">C</div>
        </div>
        <div style="font-size: 22px; font-weight: 700; color: #38ef7d; text-align: center; margin-bottom: 16px;">Codex 選手</div>
        <div style="background: rgba(56,239,125,0.1); border-radius: 12px; padding: 20px; margin-bottom: 16px;">
          <div style="font-size: 15px; color: rgba(255,255,255,0.9); line-height: 1.8;">Kimiの結論を見た後：</div>
          <div style="font-size: 20px; font-weight: 700; color: #38ef7d; margin-top: 12px; line-height: 1.4;">「彼の判断は正確ではありません。コード全体を読んだ上で、自分の結論を堅持します」</div>
        </div>
        <div style="text-align: center; padding: 12px; background: rgba(56,239,125,0.15); border-radius: 8px;">
          <span style="font-size: 14px; color: #38ef7d; font-weight: 600;">一歩も引かず</span>
        </div>
      </div>
    </div>
  </div>
</div>
</div>

**Claudeの師匠、登場：百戦錬磨の捜査術**

正直なところ、最初はClaudeを参加させるつもりはなかった。これはベンチマークではなく、本当に問題を解決したかっただけだ。しかし、先の2人がまるで違う結論を出し、それぞれに筋が通っていたので、Claudeの師匠に「最終審判」を頼むことにした。

KimiとCodexそれぞれの分析結果と改善案をClaudeに渡し、総合的に判断した上で修正に着手してもらった。

Claudeは2つの「診断報告書」を読み終えると、すぐにどちらかの味方につくのではなく、まず自ら分析を行い、両者の合理的な部分を取り入れた修正方針を立てた。データ側の不要なclient生成を削減し、キャッシュ機構を追加するというものだった。

修正完了。テストしてみた。

結果——まだ重い。

多少の改善はあったが（確かに以前よりは良くなった）、根本的な問題は依然として残っていた。

Claudeの師匠は慌てなかった。プロジェクトのコードを改めて読み直し、レンダリング時間が異常に長いことに気づくと、大胆な仮説を立てた。Next.jsのTurbopackが開発環境で抱える既知の落とし穴かもしれない、と。

「まずTurbopackをWebpackに戻してみてはどうでしょう」

言われた通りにした。`turbopack`を`webpack`に変更して再起動。

テスト——まだ問題あり。

ここで他の人間なら発狂し始めてもおかしくない。だがClaudeの師匠は、ベテラン刑事のような落ち着きを見せた。新たな結論に飛びつくのではなく、非常に印象深い一言を放った（要旨）：

「現時点では証拠が不十分です。もっと手がかりが必要です。重要な箇所にデバッグログを追加して、もう一度テストしてください。詳細なログを見せてもらえれば判断できるかもしれません」

この発想を味わってほしい。「問題はここだと思います」ではなく、「問題がどこにあるか判断するためにもっと証拠が必要です」。長年の捜査経験がにじみ出ている。

要求通り各所にdebug logを仕込み、もう一度テストして、豊富なログをすべてClaudeに渡した。

Claudeは読み終えて、しばらく考え込み……やはり特定できなかった。

Claudeの実力不足ではない。実は——重要な情報をずっと伝えていなかったのだ。何度も調査を繰り返すうちに時間がかなり経ってしまい、ようやく思い出して一言補足した：「そういえば、この問題は新しいアイコンライブラリとmotionライブラリを導入した後に発生するようになりました」

この一言は、事件における決定的な目撃者のようなものだった。それまでずっと証人保護プログラムの中にいて登場しなかったのが、いざ現れた途端に事件の全貌が一気に明らかになった。

Claudeはこの新情報とそれまでに蓄積した大量のログ証拠を組み合わせ、問題をすばやく正確に特定した。新しく導入したコンポーネントライブラリの参照方法にやはり罠があり、さらに開発環境のコンパイル機構がその影響を増幅していたのだ。

修正。テスト。パス。

完璧。

**第1ラウンド振り返り：3つの「性格」、3つの長所と短所**

このデバッグ大戦での3選手の働きぶりは、それぞれ一言で要約できる。

**Kimi**——思考は鋭く、手は極めて速い。だが「推論しただけで正解だと思い込む」傾向があり、深く検証する忍耐力に欠ける。さらに致命的なのは、別の意見に直面すると立場が揺らぎやすく、すぐに説得されてしまうことだ。デバッグにおいてこれは危険だ——自分の判断に自信がなければ、入り組んだコードの中から本当の答えを見つけられるはずがない。

**Codex**——読書量は驚異的、分析は徹底的、自分の立場を守り通す骨がある。しかし問題は、最初の推論の方向が間違っていた場合、どれだけ大量に読んでも誤った地図の上で道を探しているにすぎないということだ。「方向を間違えれば、努力は水の泡」。コードを全部読んだのに、真相にはたどり着けなかった。

**Claude**——一発で問題を解決できたわけではない（それが誰にできるだろう？）。だが、全プロセスを通じた「仕事の進め方」が最も感心させられた。結論を急がず、常に新しい証拠を集め、新たな仮説を立て、検証プランを設計する。Turbopackの切り替えからdebug logの埋め込みまで、一つ一つのステップに明確な目的があった。この「捜査型思考」こそ、複雑な問題を解決するための正しい姿勢だ。

<div class="html-image">
<div style="max-width: 900px; margin: 0 auto; font-family: -apple-system, 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif;">
  <div style="background: linear-gradient(135deg, #0c0c1d 0%, #1a1a3e 100%); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.4);">
    <div style="padding: 28px 32px; text-align: center; background: linear-gradient(90deg, rgba(102,126,234,0.3), rgba(118,75,162,0.3));">
      <div style="font-size: 26px; font-weight: 800; color: #fff;">第1ラウンド振り返り：3つの性格 × 3つの結末</div>
    </div>
    <div style="padding: 0 32px 32px;">
      <div style="display: flex; gap: 16px; margin-top: 24px;">
        <div style="flex: 1; background: rgba(0,210,255,0.08); border: 1px solid rgba(0,210,255,0.2); border-radius: 16px; padding: 24px;">
          <div style="font-size: 36px; text-align: center; margin-bottom: 8px;">&#x26A1;</div>
          <div style="font-size: 20px; font-weight: 700; color: #00d2ff; text-align: center; margin-bottom: 4px;">Kimi</div>
          <div style="font-size: 13px; color: rgba(255,255,255,0.5); text-align: center; margin-bottom: 16px;">天才少年</div>
          <div style="font-size: 14px; color: rgba(255,255,255,0.85); line-height: 1.8;">
            <div style="margin-bottom: 8px;"><span style="color: #38ef7d;">&#x2714;</span> 診断速度が極めて速い</div>
            <div style="margin-bottom: 8px;"><span style="color: #38ef7d;">&#x2714;</span> 疑わしいファイルを即座に特定</div>
            <div style="margin-bottom: 8px;"><span style="color: #ff6b6b;">&#x2718;</span> 推論しただけで結論を出す</div>
            <div><span style="color: #ff6b6b;">&#x2718;</span> 立場が不安定、すぐ寝返る</div>
          </div>
          <div style="margin-top: 16px; padding: 12px; background: rgba(0,210,255,0.1); border-radius: 8px; text-align: center;">
            <div style="font-size: 13px; color: rgba(255,255,255,0.6);">適した場面</div>
            <div style="font-size: 15px; color: #00d2ff; font-weight: 600; margin-top: 4px;">方針が明確な高速実装</div>
          </div>
        </div>
        <div style="flex: 1; background: rgba(56,239,125,0.08); border: 1px solid rgba(56,239,125,0.2); border-radius: 16px; padding: 24px;">
          <div style="font-size: 36px; text-align: center; margin-bottom: 8px;">&#x1F4DA;</div>
          <div style="font-size: 20px; font-weight: 700; color: #38ef7d; text-align: center; margin-bottom: 4px;">Codex</div>
          <div style="font-size: 13px; color: rgba(255,255,255,0.5); text-align: center; margin-bottom: 16px;">アカデミック派教授</div>
          <div style="font-size: 14px; color: rgba(255,255,255,0.85); line-height: 1.8;">
            <div style="margin-bottom: 8px;"><span style="color: #38ef7d;">&#x2714;</span> コードを全量読破</div>
            <div style="margin-bottom: 8px;"><span style="color: #38ef7d;">&#x2714;</span> 立場が揺るがない</div>
            <div style="margin-bottom: 8px;"><span style="color: #ff6b6b;">&#x2718;</span> 時間がかかりすぎ（20分超）</div>
            <div><span style="color: #ff6b6b;">&#x2718;</span> 方向を誤ると全滅</div>
          </div>
          <div style="margin-top: 16px; padding: 12px; background: rgba(56,239,125,0.1); border-radius: 8px; text-align: center;">
            <div style="font-size: 13px; color: rgba(255,255,255,0.6);">適した場面</div>
            <div style="font-size: 15px; color: #38ef7d; font-weight: 600; margin-top: 4px;">コード監査と批判的レビュー</div>
          </div>
        </div>
        <div style="flex: 1; background: rgba(168,130,255,0.08); border: 1px solid rgba(168,130,255,0.2); border-radius: 16px; padding: 24px;">
          <div style="font-size: 36px; text-align: center; margin-bottom: 8px;">&#x1F50D;</div>
          <div style="font-size: 20px; font-weight: 700; color: #a882ff; text-align: center; margin-bottom: 4px;">Claude</div>
          <div style="font-size: 13px; color: rgba(255,255,255,0.5); text-align: center; margin-bottom: 16px;">ベテラン刑事の捜査</div>
          <div style="font-size: 14px; color: rgba(255,255,255,0.85); line-height: 1.8;">
            <div style="margin-bottom: 8px;"><span style="color: #38ef7d;">&#x2714;</span> 地道に証拠を収集</div>
            <div style="margin-bottom: 8px;"><span style="color: #38ef7d;">&#x2714;</span> 仮説→検証→反復</div>
            <div style="margin-bottom: 8px;"><span style="color: #ff6b6b;">&#x2718;</span> 一発解決は難しい</div>
            <div><span style="color: #ff6b6b;">&#x2718;</span> 十分な情報提供に依存</div>
          </div>
          <div style="margin-top: 16px; padding: 12px; background: rgba(168,130,255,0.1); border-radius: 8px; text-align: center;">
            <div style="font-size: 13px; color: rgba(255,255,255,0.6);">適した場面</div>
            <div style="font-size: 15px; color: #a882ff; font-weight: 600; margin-top: 4px;">複雑な問題の体系的診断</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>

---

### 第2ラウンド：技術提案書が浮き彫りにした「認知の違い」

第1ラウンドが終わり、3選手の「性格」について初期的な理解を得た。とはいえ1回の対戦だけでは偶然かもしれない。そこで、第2のプロジェクトの出番だ。

**お題**

今回はバグ修正ではなく、設計提案だ。

PPT自動生成システムを構想していた。ユーザーがMarkdownドキュメントや簡単な一文の説明から、構造が整い論理も明快なPPTXファイルを自動生成できる仕組みだ。説明の中には、ピラミッド原則の応用、コンテンツ構造化のロジック、テキストからビジュアル要素への変換プロセスなど、多くの考えを盛り込んだ。

今回は2選手だけの出場とした。KimiとClaude。（Codexは第1ラウンドで見せた「20分読んでからやっと口を開く」特性ゆえに時間コストが高すぎるので、しばし休憩してもらった。）

同じ要件説明を2人にそれぞれ送り、各自の提案を待った。

**Kimi選手：いつも通り、速くて的確**

Kimiは再びその「速さ」を遺憾なく発揮した。

私の説明をかなり丁寧に読み込んだ——この点は公正に言っておきたい、Kimiの「要件理解」力は確かに優秀だ。その上で、私のまとまりのない思考をすばやく整理し、非常にまとまった技術提案書に仕上げた。

アーキテクチャ設計、モジュール分割、技術選定、データフロー、主要アルゴリズム……各パートが明瞭に整理されている。パッと見てかなり立派な技術提案書が目の前に並んだ。

その効率の高さは「要件翻訳機」と呼ぶにふさわしい。あなたが何を言っても、断片的な思考を構造化されたドキュメントに変換してくれる。この次元では、Kimiは確かに優秀だ。

**Claude選手：美しき「誤解」**

次はClaudeの番。

同じ要件説明を送ったところ、Claudeはしばらく沈黙し……そして動き始めた。

しばらく待ってClaudeのアウトプットが現れ始めたとき、眉をひそめた。これは……何か違わないか？

ClaudeはKimiのように技術提案書を直接出力しなかった。代わりに始まったのは、本格的な「学術調査」だった。

まず、私が説明の中で言及した「ピラミッド原則」に注目し、バーバラ・ミントのピラミッド原則理論とPPTコンテンツ構成の方法論を深掘りした。次に理論にとどまらず、インターネット上で既存のPPT自動生成プロジェクトを検索し始め、一つ一つ公式サイトやドキュメントにアクセスして技術実装とプロダクトロジックを調べていった。

最終的にClaudeが出力したのは、体系的な「PPT執筆・生成に関する業界理論調査レポート」だった。

そのレポートを前にした私の内心の対話は、おおよそこうだった：

「これは……いい。でも……私が欲しかったのはこれじゃないんだが」

「私が欲しかったのは技術提案書であって、業界調査レポートじゃないんだよ、Claudeの師匠！」

今に至るまで、なぜ意図を取り違えたのか完全には理解できていない。説明の中に方法論の話を多く盛り込みすぎて、理論的な深掘りを求めていると誤解されたのかもしれない。あるいは、比較的壮大な要件に直面したとき、Claudeは本能的に「知識の地図」を先に描き出してから、その地図を基にルートを計画しようとするのかもしれない。

理由はどうあれ、この「誤解」は思わぬ収穫をもたらした。この調査レポートの質が非常に高かったのだ。PPT生成分野の業界現況、主流ソリューションの長短比較、コンテンツ構造化の理論基盤を体系的に整理しており、後続の技術提案設計に大いに参考になる情報ばかりだった。

道を間違えたからこそ、他の人には見えない景色が見えることもある。

**「元芳、どう思う？」**

ここまで来たら、怪我の功名を活かそう。Claudeには明確に「開発提案と計画を出してほしい」と伝え（今度こそちゃんと伝わった）、作業に取りかかってもらった。

その間に、Claudeの先ほどの業界調査レポートをKimiに送り、「ご意見番、これについてどう思う？」と添えた。

Kimiの反応——案の定：「素晴らしい！この調査は非常に網羅的です！」

そしてKimiは、Claudeの調査内容を基に、先ほどの自分の技術提案書を肉付けし直した。業界実践のリファレンスを追加し、方式比較を充実させ、技術選定の検討をより精緻にした。

最後に、Kimiの更新版提案とClaudeの最終的な技術提案を並べて比較してみると——両者がほぼ一致していたのだ。


**第2ラウンド振り返り：補い合う力**

今回の観察はさらに興味深かった。

**Kimi**——相変わらずの「早撃ち」だ。明確な要件を渡せば、構造化された提案を素早く出せる。だが「要件そのものから一歩引いて考える」力が足りず、自発的に深い調査をしようとしない。しかも——Kimiには笑うべきか泣くべきか迷う特徴がある。「権威のある情報」に極めて弱いのだ。専門的に見える資料を渡せば、「素晴らしい！」と熱弁して即座に自分の提案を修正してしまう。

**Claude**——最初に意図を取り違えた（これは減点項目）。しかし「知識の全体像をまず把握してから着手する」という習慣は、確かにより堅実な仕事のやり方だ。そして最終的に、技術提案を出すよう明確に伝えた後、Claudeは自らが既に完了した調査をベースに、非常に基盤のしっかりした提案を出した。なぜなら、彼は本当にその分野を理解したのであって、ただ私の要件を翻訳しただけではなかったからだ。

2ラウンドを終えて、一つの結論が明確になった。

**万能なAIは一つもない。だが、それぞれが独自の「超能力」を持っている。**

---

### 第3ラウンド（番外編）：Geminiはエントリーしなかったが、居場所はある

2つの公式戦を語り終えたところで、Geminiにも触れておきたい。今回の「合宿」には参加しなかったが、日常業務の中でGeminiにも独自のポジションがある。

Geminiの際立つ能力は3つある。第一に、クリエイティブな色合いを持つコピーライティング。その言葉選びには他の選手にはあまりない軽やかさがある。第二に、マルチモーダルなシーン。画像の理解やデザイン関連のコンテンツを扱う際、Geminiのパフォーマンスは優れている。第三に、Googleエコシステムを活かしたDeep Research。さすがGoogle直系だけあって、インターネットの深掘り調査ではホームグラウンドの優位性が光る。

だから正式な参戦はなくとも、私の「AIチーム」においてGeminiにはしっかり居場所がある。

---

### それぞれのAIに最適な「ポジション」を

2ラウンドの実戦（に加えて日常使用の長期的な蓄積）を経て、ようやく一つのことが腑に落ちた。AIを使うのはチームを率いるのと同じで、肝心なのは「誰が最強か」ではなく「誰が何に最適か」だ。

以下が現時点での「人事配置」だ。

<div class="html-image">
<div style="max-width: 900px; margin: 0 auto; font-family: -apple-system, 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif;">
  <div style="background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%); border-radius: 24px; overflow: hidden; box-shadow: 0 24px 60px rgba(0,0,0,0.5);">
    <div style="padding: 36px 40px 20px; text-align: center;">
      <div style="font-size: 30px; font-weight: 900; color: #fff; letter-spacing: 4px;">AI ドリームチーム布陣</div>
      <div style="font-size: 15px; color: rgba(255,255,255,0.5); margin-top: 8px;">適材適所で AI を配置する</div>
    </div>
    <div style="display: flex; flex-wrap: wrap; gap: 16px; padding: 20px 32px 36px;">
      <div style="flex: 1; min-width: 180px; background: linear-gradient(180deg, rgba(255,183,77,0.15), rgba(255,183,77,0.05)); border: 1px solid rgba(255,183,77,0.3); border-radius: 16px; padding: 24px 20px;">
        <div style="font-size: 32px; text-align: center; margin-bottom: 8px;">&#x1F3A8;</div>
        <div style="font-size: 18px; font-weight: 700; color: #ffb74d; text-align: center;">Gemini</div>
        <div style="font-size: 12px; color: rgba(255,255,255,0.5); text-align: center; margin-bottom: 12px;">クリエイティブ統括 / リサーチ</div>
        <div style="font-size: 13px; color: rgba(255,255,255,0.8); line-height: 1.7;">
          &#x2022; クリエイティブコピー<br/>
          &#x2022; マルチモーダルデザイン<br/>
          &#x2022; Google Deep Research
        </div>
      </div>
      <div style="flex: 1; min-width: 180px; background: linear-gradient(180deg, rgba(56,239,125,0.15), rgba(56,239,125,0.05)); border: 1px solid rgba(56,239,125,0.3); border-radius: 16px; padding: 24px 20px;">
        <div style="font-size: 32px; text-align: center; margin-bottom: 8px;">&#x1F50E;</div>
        <div style="font-size: 18px; font-weight: 700; color: #38ef7d; text-align: center;">Codex</div>
        <div style="font-size: 12px; color: rgba(255,255,255,0.5); text-align: center; margin-bottom: 12px;">コード監査 / 品質管理</div>
        <div style="font-size: 13px; color: rgba(255,255,255,0.8); line-height: 1.7;">
          &#x2022; 全体コード把握<br/>
          &#x2022; テスト・品質レビュー<br/>
          &#x2022; 方針の批判的検証
        </div>
      </div>
      <div style="flex: 1; min-width: 180px; background: linear-gradient(180deg, rgba(0,210,255,0.15), rgba(0,210,255,0.05)); border: 1px solid rgba(0,210,255,0.3); border-radius: 16px; padding: 24px 20px;">
        <div style="font-size: 32px; text-align: center; margin-bottom: 8px;">&#x1F3C3;</div>
        <div style="font-size: 18px; font-weight: 700; color: #00d2ff; text-align: center;">Kimi</div>
        <div style="font-size: 12px; color: rgba(255,255,255,0.5); text-align: center; margin-bottom: 12px;">高速実装担当</div>
        <div style="font-size: 13px; color: rgba(255,255,255,0.8); line-height: 1.7;">
          &#x2022; 要件明確時の高速開発<br/>
          &#x2022; 低複雑度の日常コーディング<br/>
          &#x2022; コスト面で優秀
        </div>
      </div>
      <div style="flex: 1; min-width: 180px; background: linear-gradient(180deg, rgba(168,130,255,0.15), rgba(168,130,255,0.05)); border: 1px solid rgba(168,130,255,0.3); border-radius: 16px; padding: 24px 20px;">
        <div style="font-size: 32px; text-align: center; margin-bottom: 8px;">&#x1F451;</div>
        <div style="font-size: 18px; font-weight: 700; color: #a882ff; text-align: center;">Claude</div>
        <div style="font-size: 12px; color: rgba(255,255,255,0.5); text-align: center; margin-bottom: 12px;">チーフアーキテクト / 技術統括</div>
        <div style="font-size: 13px; color: rgba(255,255,255,0.8); line-height: 1.7;">
          &#x2022; 設計・アーキテクチャ<br/>
          &#x2022; 複雑な問題の診断<br/>
          &#x2022; リファクタリング期の中核
        </div>
      </div>
    </div>
  </div>
</div>
</div>

**Gemini——クリエイティブディレクター／リサーチャー**

担当：クリエイティブな色合いを持つコピーライティング、デザイン関連のマルチモーダルタスク、Googleエコシステムを活用したディープリサーチ。

Geminiの雰囲気は、チーム内で最も発想が自由なクリエイティブ担当に近い。堅いテクニカルドキュメントを書かせると暴走気味になることもあるが、ブレインストーミングやコピー作成、インスピレーション探しでは、思いもよらない切り口を提示してくれることが多い。

**Codex——コード監査官／品質管理**

担当：プロジェクト全体のコード把握と品質レビュー、テスト作業、提案の批判的レビュー。

Codexはチームの中の「学究肌」だ。最大の武器は、本当にプロジェクトのコードを全部読み通すこと。この「読書狂」の性質のおかげで、全体を俯瞰したコード理解と品質の番人の役割にうってつけだ。

さらに、読む量が多いからこそ、Codexには特に向いている役割がある。提案の「批判者」だ。他のAIが出した提案をCodexに審査させると、コード全体の理解に基づいて実現可能性と潜在リスクを評価する。しかもあの「テコでも動かない」頑固さがあるから、提案が「一見良さそう」だからといって甘い評価はしない。

**Kimi——高速実装担当**

担当：要件が明確で方針が固まった状態での高速開発、複雑度の低い日常的なコーディングタスク。

Kimiはチームに入ったばかりの優秀な新卒のようなものだ。頭が良くて手が速くてエネルギッシュ。明確に定義されたタスクを渡せば、速くてクオリティの高い仕事をしてくれる。ただし、曖昧な要件を渡して自分で探らせるのは禁物だ。すぐに回答を出してくるのだが、その回答は一見もっともらしくても、深く掘ると耐えられないかもしれない。

Kimiの使い方の鉄則は：**自分でしっかり考え、細部まで詰めてから、実装を任せること。** 意思決定者としては不向きだが、実行者としてはフル回転してくれる。

コスト面でも、Kimiは最も「お財布に優しい」。日常の「力仕事」レベルのコーディングに、わざわざClaudeの計算リソースを使う必要はない。

**Claude——チーフアーキテクト／技術統括**

担当：重要な設計フェーズ、システムアーキテクチャフェーズ、リファクタリングフェーズの中核的業務。複雑な問題の診断と解決。

Claudeはチームの「主力ベテラン」だ。

ただしベテランゆえに、避けられない「中年の危機」のような症状もある。値段が高い（Tokenコストは確かに割高）、たまに「知力低下」する（パフォーマンスにムラがある）、スタミナが切れやすい（Token消費でクールダウンが必要）。

それでも肝心な場面では、やはり頼りになる。設計提案、アーキテクチャ上の判断、難問の診断——深い思考と体系的な分析が求められるこれらの業務で、Claudeの安定感は依然として抜きん出ている。

しかもClaude CodeのSkillsエコシステムが充実し続けていることで（各種拡張機能が増え続けている）、Claudeの「地位」はむしろ強化されつつある。ツールチェーンの優位性は雪だるま式に膨らむ——エコシステムが充実するほどできることが増え、代替されにくくなる。

ちなみにSkillsエコシステムに関して一つ面白い話がある。Kimi CLIがClaudeのユーザーレベルのSkillをそのまま使えてしまうのだ。これはまるで新入社員がベテランの長年かけて蓄積したワークテンプレートをそのまま使うようなもので、少し「タダ乗り」感はあるが、全体の効率は確実に上がる。

---

### 深掘り：ハイブリッドAIワークフローの方法論

今回の実戦テストを経て、より深い考察を共有したい。複数のAIコーディングアシスタントを本当に効果的に「使い分ける」にはどうすればよいか。

**原則1：チームを管理するようにAIを管理する**

これは空言ではない。各AIにはそれぞれ「性格的特徴」があり、その特徴を理解することが、使いこなすための前提だ。

新卒の新人にアーキテクチャ設計を任せることはしないし、ベテランアーキテクトに単純なCRUDを書かせたりもしない。同じ論理で、深掘り調査が必要な複雑な問題をKimiに投げるべきではないし、シンプルで明確な力仕事をClaudeにやらせるべきでもない。

**原則2：「クロスバリデーション」で精度を高める**

今回のテストで最も価値があった手法の一つが、あるAIの結論を別のAIに見せて互いにレビューさせたことだ。

Kimiが即座に「寝返った」のは苦笑ものだったが、Codexが自分の立場を堅持した振る舞いこそ、異なるAIの結論をぶつけ合うことが有効な品質管理手段であることを裏付けている。

実務での私のやり方は、重要な技術判断については少なくとも2つの異なるAIに独立した意見を出させ、それから総合判断を下すこと。医学における「カンファレンス」と同じだ——視点が一つ増えれば、死角が一つ減る。

**原則3：「思考型タスク」と「実行型タスク」を区別する**

これがAI使い分けの最も核心的な心得だ。

「思考型タスク」——深い分析、設計提案、問題診断、戦略立案が必要な仕事。この種のタスクのカギは「思考の質」であり、スピードはむしろ二の次だ。Claudeに任せるか、複数AIのクロスバリデーションを行う。

「実行型タスク」——要件が明確で方針も確定していて、あとはコードを書くだけの仕事。この種のタスクのカギは「実行効率」であり、思考の深さはかえって余計だ。Kimiに任せれば速くて安い。

**原則4：重要な情報は省略しない**

第1ラウンドで私が犯したミスは、繰り返し強調する価値がある。「問題は新しいライブラリを導入した後に発生するようになった」とClaudeに伝えたのが最後の最後だった。最初から伝えていれば、調査プロセスは大幅に短縮されていたかもしれない。

AIがどれほど賢くても、あなたの頭の中の情報を読み取ることはできない。あなたにとって「当たり前」の背景知識が、AIにとっては決定的な手がかりかもしれない。AIに問題を説明するときは、背景情報を多めに伝えるのが正解で、「推測できるだろう」と期待するのは禁物だ。

この点は、チームマネジメントでもまったく同じだ——口に出していない「自明の」前提条件を部下がすでに知っていると思い込んではいけない。

**原則5：安いからといって代替できるとは限らない**

Kimiの価格はClaudeよりずっと手頃で、これは大きなメリットだ。しかし2ラウンドの実戦を経て、はっきり言える——KimiがClaudeを100%置き換えることはできない。

Kimiが悪いのではなく、両者の「能力プロフィール」が根本的に異なるのだ。Kimiは「実行効率」の次元ではClaudeに引けを取らないかもしれないが、「思考の深さ」「自発的な調査」「複雑な問題への対応力」といった次元では、差がはっきりと見える。

最もわかりやすい例が「立場の問題」だ。異なる見解に直面したとき、Claudeは自らの分析に基づいて判断を下すが、Kimiは「大勢に流れる」傾向がある。単純な問題を解く場合はどうでもいいことだが、複雑で多要素が絡み合う技術的難題に立ち向かう際、この「立場のなさ」は誤った方向にどんどん進んでいくリスクにつながる。

節約はもちろん良いことだ。だが肝心な場面で間違ったAIを使ってしまったら、失われる時間のコストは節約したToken代をはるかに上回りかねない。

---

### おわりに：「AIチームマネジメント」時代の到来

ここまで書いてきて、今回の「武闘大会」の全過程を振り返ると、最大の気づきは「どのAIが最強か」ではなかった。

**AIの使い方は、「最良の一つを選ぶ」から「最適なチームを組む」へと変わりつつある。**

<div class="html-image">
<div style="max-width: 900px; margin: 0 auto; font-family: -apple-system, 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif;">
  <div style="padding: 56px 48px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: center;">
    <div style="font-size: 48px; font-weight: 900; color: #ffffff; margin-bottom: 20px; text-shadow: 0 4px 12px rgba(0,0,0,0.3); letter-spacing: 6px; line-height: 1.3;">
      最強の AI はいない<br/>最適なチームがあるだけだ
    </div>
    <div style="width: 60px; height: 3px; background: rgba(255,255,255,0.5); margin: 24px auto;"></div>
    <div style="font-size: 20px; color: rgba(255,255,255,0.9); line-height: 1.8; font-weight: 300; max-width: 600px; margin: 0 auto;">
      AI は安い。高いのはあなたの時間と<br/>正しい判断を下す力だ
    </div>
  </div>
</div>
</div>

現実世界に完璧な社員がいないように、AI世界にも完璧なアシスタントはいない。どのAIにも長所と短所があり、肝心なのはその特徴を理解し、適切なタスクを適切なAIに任せられるかどうかだ。

言うのは簡単だが、実践するには新しい能力が必要だ。仮に「AIチームマネジメント力」と呼ぼう。それには以下が含まれる：

1. **AI選定力**：各AIアシスタントの能力特性と適用場面を理解する
2. **タスク分解力**：複雑な仕事を、異なるAIに適したサブタスクに分割する
3. **クロスバリデーション力**：複数のAIを活用して互いに検証し、アウトプットの質を高める
4. **情報伝達力**：効率的かつ漏れなくAIに背景情報と要件を伝える
5. **成果統合力**：複数のAIからのアウトプットを一貫した最終成果に統合する

これらの能力は、本質的にはマネジメント力のAI時代における新たな延長線上にある。

未来の技術マネージャーは、人を管理するだけでなく、AIも管理することになるだろう。そしてAIを管理する根底のロジックは、人を管理するのと驚くほど似ている。各「チームメンバー」の特徴を理解し、タスクを合理的に配分し、効果的な協働の仕組みを築き、肝心な場面で正しい判断を下す。

だから、今もまだ「結局どのAIを使えばいいのか」と迷っているなら、私のアドバイスはこうだ——迷うのはやめて、全部使おう。そしてチームを率いるように、各AIに最も適したポジションを見つけてやればいい。

なにしろ今の時代、AIは安い（まあClaudeはちょっと高いけど）。高いのは、あなたの時間と、正しい判断を下す力だ。

---

*本記事は、筆者の2026年2月におけるAIコーディングアシスタントの実戦使用経験に基づいています。記事中のツールにはKimi CLI（K2.5モデル）、Claude Code、OpenAI Codex CLIが含まれます。具体的な性能は、バージョン更新、タスクの種類、プロンプトの質などの要因によって異なる可能性があります。*
