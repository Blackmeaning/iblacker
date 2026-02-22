import { generateBlueprint } from "./blueprint";

export async function generateProjectFiles(prompt: string) {
  const blueprint: any = await generateBlueprint(prompt);

  const packageJson = {
    name: blueprint.name?.toLowerCase().replace(/\s+/g, "-") || "iblacker-app",
    version: "0.1.0",
    private: true,
    scripts: {
      dev: "next dev",
      build: "next build",
      start: "next start"
    },
    dependencies: {
      next: "latest",
      react: "latest",
      "react-dom": "latest"
    }
  };

  const indexPage = `
export default function Home() {
  return (
    <main style={{padding: 40}}>
      <h1>${blueprint.name}</h1>
      <p>${blueprint.description}</p>
    </main>
  );
}
`;

  return {
    blueprint,
    files: {
      "package.json": JSON.stringify(packageJson, null, 2),
      "app/page.tsx": indexPage
    }
  };
}