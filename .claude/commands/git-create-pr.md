# PRを作成

- 作成済みのPRがある場合はDescriptionを更新すること
- Read @.github/PULL_REQUEST_TEMPLATE.md に従うこと
- Draftで作成すること
- PRのtitleとdescriptionは日本語で記載すること
- push時は`git push -u origin <branch_name>` のように `--set-upstream` を指定すること
- コマンドの例: `gh pr create --draft --title "title" --body "body"`
- 作成したPRは、https://github.com/users/shogo452/projects/14 の In Progress に入れてください
- 関連するIssueがある場合は、説明欄でRef.として記載してください
- PRの変更によってIssueがクローズできる場合は、`- Close: [PRリンク]` としてください。
