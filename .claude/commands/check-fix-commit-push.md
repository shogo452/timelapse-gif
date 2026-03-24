# lint・テスト実行 → 修正 → コミット → プッシュ

backend, frontend の各種チェックを実行し、エラーがあれば修正。すべてパスしたらコミット & プッシュする。

## 実行手順

### 1. チェックの実行（可能な限り並列実行する）

以下をすべて実行する:

#### Backend (`backend/` 配下に変更がある場合)
- `cd backend && make lint`
- `cd backend && make test`

#### Frontend (`frontend/` 配下に変更がある場合)
- `cd frontend && pnpm lint`
- `cd frontend && pnpm exec tsc --noEmit`
- `cd frontend && pnpm test`
- `cd frontend && pnpm test:e2e`

### 2. エラー修正

- エラーが出た場合は修正を行い、該当のチェックを再実行する
- すべてのチェックがパスするまで繰り返す
- E2Eテストがローカル環境の問題（Supabase未起動など）で失敗する場合は、コードに起因しないためスキップ可

### 3. develop ブランチとのコンフリクト確認

1. `git fetch origin develop` で最新の develop を取得
2. `git diff --name-only origin/develop...HEAD` で変更ファイルを確認
3. `git merge --no-commit --no-ff origin/develop` でコンフリクトの有無を確認
4. コンフリクトがある場合は解消してからコミットする
5. コンフリクトがない場合は `git merge --abort` でマージを取り消す

### 4. コミット & プッシュ

すべてのチェックがパスしたら:

1. Read @git-create-commit.md に従ってコミットを作成
2. `git push origin <current-branch>` でプッシュ
