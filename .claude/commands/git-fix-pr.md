# git worktree でPRを修正

渡されたPR番号（またはURL）のPRを、git worktreeを使って修正するスキルです。

## 引数

- `$ARGUMENTS` にPR番号またはPR URLが渡される（例: `42`, `https://github.com/shogo452/kondate/pull/42`）

## 実行手順

### 1. PR情報の取得

```bash
gh pr view <PR番号> --json number,title,body,headRefName,baseRefName,url,state,reviewDecision,statusCheckRollup
```

- PRの状態を確認（open でなければ警告）
- ブランチ名（headRefName）を取得
- PRの内容（title, body）を読み、何のPRか理解する
- CIのステータスやレビューコメントも確認する

### 2. レビューコメントの確認

```bash
gh pr view <PR番号> --comments
gh api repos/shogo452/kondate/pulls/<PR番号>/comments
gh api repos/shogo452/kondate/pulls/<PR番号>/reviews
```

- レビューで指摘された内容を把握する
- 修正すべき点をリストアップする

### 3. CIステータスの確認

```bash
gh pr checks <PR番号>
```

- 全チェックの結果（pass / fail / pending）を確認する
- 失敗しているチェックがある場合:
  - `gh run view <run_id> --log-failed` で失敗ログを取得し、原因を特定する
  - 修正すべき内容をリストアップし、ステップ5の作業に含める
- 全チェックがpassしている場合はこのステップをスキップ

### 4. git worktree の作成

```bash
git fetch origin <headRefName>
git worktree add ../kondate-pr-<PR番号> <headRefName>
```

- worktreeのパスは `../kondate-pr-<PR番号>` とする（例: `../kondate-pr-42`）
- リモートブランチを fetch してから worktree を作成する
- 既に同名の worktree が存在する場合は、一度削除してから再作成する

### 5. worktree での作業

- worktree ディレクトリに移動して作業する
- 必要に応じて依存関係をインストールする（`pnpm install`, `go mod download` など）
- PRの内容やレビューコメントに基づいて修正を行う
- ステップ3でCI失敗が見つかった場合は、その修正も行う
- 修正内容はユーザーに確認しながら進める

### 6. コミットとプッシュ

修正が完了したら:

1. Read @git-create-commit.md に従ってコミットを実行
2. `git push origin <headRefName>` でプッシュ

### 7. CIの再確認

プッシュ後、CIが再実行されるので結果を確認する:

```bash
gh pr checks <PR番号> --watch
```

- 全チェックがpassするまで待機する
- 再度失敗した場合は、ステップ5に戻って修正を繰り返す
- 全チェックがpassしたらユーザーに報告する

### 8. worktree のクリーンアップ

作業完了後、ユーザーに確認してから:

```bash
cd <元のリポジトリパス>
git worktree remove ../kondate-pr-<PR番号>
```

- 元のリポジトリディレクトリに戻ること
- worktree を削除すること
- 未コミットの変更がある場合は警告すること

## 注意事項

- worktree 内で作業中は、元のリポジトリの同じブランチをチェックアウトしないこと
- 修正前に必ずPRの差分を確認すること: `gh pr diff <PR番号>`
- 大きな修正の場合は、段階的にコミットすること
- worktree のパスは常に `../kondate-pr-<PR番号>` の形式を使うこと
