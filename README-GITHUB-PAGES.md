# GitHub Pages deployment add-on

Upload the contents of this package into the ROOT of the existing repository:

9988somagi-lab/bpi-website-codex

After upload, the repository should contain:

.github/
  workflows/
    deploy.yml

Do NOT create an extra bpi-website-github-pages folder in the repository.

Then in GitHub:

1. Open the repository.
2. Go to Settings.
3. Open Pages.
4. Under "Build and deployment" / "Source", select "GitHub Actions" if it is not already selected.
5. Open the Actions tab and wait for "Deploy BPI Website to GitHub Pages" to finish successfully.
6. The public preview URL should be similar to:
   https://9988somagi-lab.github.io/bpi-website-codex/

After this, every push to the main branch will rebuild and redeploy the website automatically.
