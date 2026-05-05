#!/usr/bin/env python3
"""
Tailwind CSS Configuration Generator

Generate tailwind.config.js/ts with custom theme configuration.
Supports colors, fonts, spacing, breakpoints, and plugin recommendations.
"""

import argparse
import json
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional

class TailwindConfigGenerator:
 """Generate Tailwind CSS configuration files."""

 def \_\_init\_\_(
 self,
 typescript: bool = True,
 framework: str = "react",
 output\_path: Optional\[Path\] = None,
 ):
 """
 Initialize generator.

 Args:
 typescript: If True, generate .ts config, else .js
 framework: Framework name (react, vue, svelte, nextjs)
 output\_path: Output file path (default: auto-detect)
 """
 self.typescript = typescript
 self.framework = framework
 self.output\_path = output\_path or self.\_default\_output\_path()
 self.config: Dict\[str, Any\] = self.\_base\_config()

 def \_default\_output\_path(self) -> Path:
 """Determine default output path."""
 ext = "ts" if self.typescript else "js"
 return Path.cwd() / f"tailwind.config.{ext}"

 def \_base\_config(self) -> Dict\[str, Any\]:
 """Create base configuration structure."""
 return {
 "darkMode": \["class"\],
 "content": self.\_default\_content\_paths(),
 "theme": {
 "extend": {}
 },
 "plugins": \[\]
 }

 def \_default\_content\_paths(self) -> List\[str\]:
 """Get default content paths for framework."""
 paths = {
 "react": \[\
 "./src/\*\*/\*.{js,jsx,ts,tsx}",\
 "./index.html",\
 \],
 "vue": \[\
 "./src/\*\*/\*.{vue,js,ts,jsx,tsx}",\
 "./index.html",\
 \],
 "svelte": \[\
 "./src/\*\*/\*.{svelte,js,ts}",\
 "./src/app.html",\
 \],
 "nextjs": \[\
 "./app/\*\*/\*.{js,ts,jsx,tsx}",\
 "./pages/\*\*/\*.{js,ts,jsx,tsx}",\
 "./components/\*\*/\*.{js,ts,jsx,tsx}",\
 \],
 }
 return paths.get(self.framework, paths\["react"\])

 def add\_colors(self, colors: Dict\[str, str\]) -> None:
 """
 Add custom colors to theme.

 Args:
 colors: Dict of color\_name: color\_value
 Value can be hex (#3b82f6) or variable (hsl(var(--primary)))
 """
 if "colors" not in self.config\["theme"\]\["extend"\]:
 self.config\["theme"\]\["extend"\]\["colors"\] = {}

 self.config\["theme"\]\["extend"\]\["colors"\].update(colors)

 def add\_color\_palette(self, name: str, base\_color: str) -> None:
 """
 Add full color palette (50-950 shades) for a base color.

 Args:
 name: Color name (e.g., 'brand', 'primary')
 base\_color: Base color in oklch format or hex
 """
 # For simplicity, use CSS variable approach
 if "colors" not in self.config\["theme"\]\["extend"\]:
 self.config\["theme"\]\["extend"\]\["colors"\] = {}

 self.config\["theme"\]\["extend"\]\["colors"\]\[name\] = {
 "50": f"var(--color-{name}-50)",
 "100": f"var(--color-{name}-100)",
 "200": f"var(--color-{name}-200)",
 "300": f"var(--color-{name}-300)",
 "400": f"var(--color-{name}-400)",
 "500": f"var(--color-{name}-500)",
 "600": f"var(--color-{name}-600)",
 "700": f"var(--color-{name}-700)",
 "800": f"var(--color-{name}-800)",
 "900": f"var(--color-{name}-900)",
 "950": f"var(--color-{name}-950)",
 }

 def add\_fonts(self, fonts: Dict\[str, List\[str\]\]) -> None:
 """
 Add custom font families.

 Args:
 fonts: Dict of font\_type: \[font\_names\]
 e.g., {'sans': \['Inter', 'system-ui', 'sans-serif'\]}
 """
 if "fontFamily" not in self.config\["theme"\]\["extend"\]:
 self.config\["theme"\]\["extend"\]\["fontFamily"\] = {}

 self.config\["theme"\]\["extend"\]\["fontFamily"\].update(fonts)

 def add\_spacing(self, spacing: Dict\[str, str\]) -> None:
 """
 Add custom spacing values.

 Args:
 spacing: Dict of name: value
 e.g., {'18': '4.5rem', 'navbar': '4rem'}
 """
 if "spacing" not in self.config\["theme"\]\["extend"\]:
 self.config\["theme"\]\["extend"\]\["spacing"\] = {}

 self.config\["theme"\]\["extend"\]\["spacing"\].update(spacing)

 def add\_breakpoints(self, breakpoints: Dict\[str, str\]) -> None:
 """
 Add custom breakpoints.

 Args:
 breakpoints: Dict of name: width
 e.g., {'3xl': '1920px', 'tablet': '768px'}
 """
 if "screens" not in self.config\["theme"\]\["extend"\]:
 self.config\["theme"\]\["extend"\]\["screens"\] = {}

 self.config\["theme"\]\["extend"\]\["screens"\].update(breakpoints)

 def add\_plugins(self, plugins: List\[str\]) -> None:
 """
 Add plugin requirements.

 Args:
 plugins: List of plugin names
 e.g., \['@tailwindcss/typography', '@tailwindcss/forms'\]
 """
 for plugin in plugins:
 if plugin not in self.config\["plugins"\]:
 self.config\["plugins"\].append(plugin)

 def recommend\_plugins(self) -> List\[str\]:
 """
 Get plugin recommendations based on configuration.

 Returns:
 List of recommended plugin package names
 """
 recommendations = \[\]

 # Always recommend animation plugin
 recommendations.append("tailwindcss-animate")

 # Framework-specific recommendations
 if self.framework == "nextjs":
 recommendations.append("@tailwindcss/typography")

 return recommendations

 def generate\_config\_string(self) -> str:
 """
 Generate configuration file content.

 Returns:
 Configuration file as string
 """
 if self.typescript:
 return self.\_generate\_typescript()
 return self.\_generate\_javascript()

 def \_generate\_typescript(self) -> str:
 """Generate TypeScript configuration."""
 plugins\_str = self.\_format\_plugins()

 config\_json = json.dumps(self.config, indent=2)

 # Remove plugin array from JSON (we'll add it with require())
 config\_obj = self.config.copy()
 config\_obj.pop("plugins", None)
 config\_json = json.dumps(config\_obj, indent=2)

 return f"""import type {{ Config }} from 'tailwindcss'

const config: Config = {{
{self.\_indent\_json(config\_json, 1)}
 plugins: \[{plugins\_str}\],
}}

export default config
"""

 def \_generate\_javascript(self) -> str:
 """Generate JavaScript configuration."""
 plugins\_str = self.\_format\_plugins()

 config\_obj = self.config.copy()
 config\_obj.pop("plugins", None)
 config\_json = json.dumps(config\_obj, indent=2)

 return f"""/\*\* @type {{import('tailwindcss').Config}} \*/
module.exports = {{
{self.\_indent\_json(config\_json, 1)}
 plugins: \[{plugins\_str}\],
}}
"""

 def \_format\_plugins(self) -> str:
 """Format plugins array for config."""
 if not self.config\["plugins"\]:
 return ""

 plugin\_requires = \[\
 f"require('{plugin}')" for plugin in self.config\["plugins"\]\
 \]
 return ", ".join(plugin\_requires)

 def \_indent\_json(self, json\_str: str, level: int) -> str:
 """Add indentation to JSON string."""
 indent = " " \* level
 lines = json\_str.split("\\n")
 # Skip first and last lines (braces)
 indented = \[indent + line for line in lines\[1:-1\]\]
 return "\\n".join(indented)

 def write\_config(self) -> tuple\[bool, str\]:
 """
 Write configuration to file.

 Returns:
 Tuple of (success, message)
 """
 try:
 config\_content = self.generate\_config\_string()

 self.output\_path.write\_text(config\_content)

 return True, f"Configuration written to {self.output\_path}"

 except OSError as e:
 return False, f"Failed to write config: {e}"

 def validate\_config(self) -> tuple\[bool, str\]:
 """
 Validate configuration.

 Returns:
 Tuple of (valid, message)
 """
 # Check content paths exist
 if not self.config\["content"\]:
 return False, "No content paths specified"

 # Check if extending empty theme
 if not self.config\["theme"\]\["extend"\]:
 return True, "Warning: No theme extensions defined"

 return True, "Configuration valid"

def main():
 """CLI entry point."""
 parser = argparse.ArgumentParser(
 description="Generate Tailwind CSS configuration",
 formatter\_class=argparse.RawDescriptionHelpFormatter,
 epilog="""
Examples:
 # Generate TypeScript config for Next.js
 python tailwind\_config\_gen.py --framework nextjs

 # Generate JavaScript config with custom colors
 python tailwind\_config\_gen.py --js --colors brand:#3b82f6 accent:#8b5cf6

 # Add custom fonts
 python tailwind\_config\_gen.py --fonts display:"Playfair Display,serif"

 # Add custom spacing and breakpoints
 python tailwind\_config\_gen.py --spacing navbar:4rem --breakpoints 3xl:1920px

 # Add recommended plugins
 python tailwind\_config\_gen.py --plugins
 """,
 )

 parser.add\_argument(
 "--framework",
 choices=\["react", "vue", "svelte", "nextjs"\],
 default="react",
 help="Target framework (default: react)",
 )

 parser.add\_argument(
 "--js",
 action="store\_true",
 help="Generate JavaScript config instead of TypeScript",
 )

 parser.add\_argument(
 "--output",
 type=Path,
 help="Output file path",
 )

 parser.add\_argument(
 "--colors",
 nargs="\*",
 metavar="NAME:VALUE",
 help="Custom colors (e.g., brand:#3b82f6)",
 )

 parser.add\_argument(
 "--fonts",
 nargs="\*",
 metavar="TYPE:FAMILY",
 help="Custom fonts (e.g., sans:'Inter,system-ui')",
 )

 parser.add\_argument(
 "--spacing",
 nargs="\*",
 metavar="NAME:VALUE",
 help="Custom spacing (e.g., navbar:4rem)",
 )

 parser.add\_argument(
 "--breakpoints",
 nargs="\*",
 metavar="NAME:WIDTH",
 help="Custom breakpoints (e.g., 3xl:1920px)",
 )

 parser.add\_argument(
 "--plugins",
 action="store\_true",
 help="Add recommended plugins",
 )

 parser.add\_argument(
 "--validate-only",
 action="store\_true",
 help="Validate config without writing file",
 )

 args = parser.parse\_args()

 # Initialize generator
 generator = TailwindConfigGenerator(
 typescript=not args.js,
 framework=args.framework,
 output\_path=args.output,
 )

 # Add custom colors
 if args.colors:
 colors = {}
 for color\_spec in args.colors:
 try:
 name, value = color\_spec.split(":", 1)
 colors\[name\] = value
 except ValueError:
 print(f"Invalid color spec: {color\_spec}", file=sys.stderr)
 sys.exit(1)
 generator.add\_colors(colors)

 # Add custom fonts
 if args.fonts:
 fonts = {}
 for font\_spec in args.fonts:
 try:
 font\_type, family = font\_spec.split(":", 1)
 fonts\[font\_type\] = \[f.strip().strip("'\\"") for f in family.split(",")\]
 except ValueError:
 print(f"Invalid font spec: {font\_spec}", file=sys.stderr)
 sys.exit(1)
 generator.add\_fonts(fonts)

 # Add custom spacing
 if args.spacing:
 spacing = {}
 for spacing\_spec in args.spacing:
 try:
 name, value = spacing\_spec.split(":", 1)
 spacing\[name\] = value
 except ValueError:
 print(f"Invalid spacing spec: {spacing\_spec}", file=sys.stderr)
 sys.exit(1)
 generator.add\_spacing(spacing)

 # Add custom breakpoints
 if args.breakpoints:
 breakpoints = {}
 for bp\_spec in args.breakpoints:
 try:
 name, width = bp\_spec.split(":", 1)
 breakpoints\[name\] = width
 except ValueError:
 print(f"Invalid breakpoint spec: {bp\_spec}", file=sys.stderr)
 sys.exit(1)
 generator.add\_breakpoints(breakpoints)

 # Add recommended plugins
 if args.plugins:
 recommended = generator.recommend\_plugins()
 generator.add\_plugins(recommended)
 print(f"Added recommended plugins: {', '.join(recommended)}")
 print("\\nInstall with:")
 print(f" npm install -D {' '.join(recommended)}")

 # Validate
 valid, message = generator.validate\_config()
 if not valid:
 print(f"Validation failed: {message}", file=sys.stderr)
 sys.exit(1)

 if message.startswith("Warning"):
 print(message)

 # Validate only mode
 if args.validate\_only:
 print("Configuration valid")
 print("\\nGenerated config:")
 print(generator.generate\_config\_string())
 sys.exit(0)

 # Write config
 success, message = generator.write\_config()
 print(message)
 sys.exit(0 if success else 1)

if \_\_name\_\_ == "\_\_main\_\_":
 main()