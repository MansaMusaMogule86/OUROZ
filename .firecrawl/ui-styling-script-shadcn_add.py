#!/usr/bin/env python3
"""
shadcn/ui Component Installer

Add shadcn/ui components to project with automatic dependency handling.
Wraps shadcn CLI for programmatic component installation.
"""

import argparse
import json
import subprocess
import sys
from pathlib import Path
from typing import List, Optional

class ShadcnInstaller:
 """Handle shadcn/ui component installation."""

 def \_\_init\_\_(self, project\_root: Optional\[Path\] = None, dry\_run: bool = False):
 """
 Initialize installer.

 Args:
 project\_root: Project root directory (default: current directory)
 dry\_run: If True, show actions without executing
 """
 self.project\_root = project\_root or Path.cwd()
 self.dry\_run = dry\_run
 self.components\_json = self.project\_root / "components.json"

 def check\_shadcn\_config(self) -> bool:
 """
 Check if shadcn is initialized in project.

 Returns:
 True if components.json exists
 """
 return self.components\_json.exists()

 def get\_installed\_components(self) -> List\[str\]:
 """
 Get list of already installed components.

 Returns:
 List of installed component names
 """
 if not self.check\_shadcn\_config():
 return \[\]

 try:
 with open(self.components\_json) as f:
 config = json.load(f)

 components\_dir = self.project\_root / config.get("aliases", {}).get(
 "components", "components"
 ).replace("@/", "")
 ui\_dir = components\_dir / "ui"

 if not ui\_dir.exists():
 return \[\]

 return \[f.stem for f in ui\_dir.glob("\*.tsx") if f.is\_file()\]
 except (json.JSONDecodeError, KeyError, OSError):
 return \[\]

 def add\_components(
 self, components: List\[str\], overwrite: bool = False
 ) -\> tuple\[bool, str\]:
 """
 Add shadcn/ui components.

 Args:
 components: List of component names to add
 overwrite: If True, overwrite existing components

 Returns:
 Tuple of (success, message)
 """
 if not components:
 return False, "No components specified"

 if not self.check\_shadcn\_config():
 return (
 False,
 "shadcn not initialized. Run 'npx shadcn@latest init' first",
 )

 # Check which components already exist
 installed = self.get\_installed\_components()
 already\_installed = \[c for c in components if c in installed\]

 if already\_installed and not overwrite:
 return (
 False,
 f"Components already installed: {', '.join(already\_installed)}. "
 "Use --overwrite to reinstall",
 )

 # Build command
 cmd = \["npx", "shadcn@latest", "add"\] + components

 if overwrite:
 cmd.append("--overwrite")

 if self.dry\_run:
 return True, f"Would run: {' '.join(cmd)}"

 # Execute command
 try:
 result = subprocess.run(
 cmd,
 cwd=self.project\_root,
 capture\_output=True,
 text=True,
 check=True,
 )

 success\_msg = f"Successfully added components: {', '.join(components)}"
 if result.stdout:
 success\_msg += f"\\n\\nOutput:\\n{result.stdout}"

 return True, success\_msg

 except subprocess.CalledProcessError as e:
 error\_msg = f"Failed to add components: {e.stderr or e.stdout or str(e)}"
 return False, error\_msg
 except FileNotFoundError:
 return False, "npx not found. Ensure Node.js is installed"

 def add\_all\_components(self, overwrite: bool = False) -> tuple\[bool, str\]:
 """
 Add all available shadcn/ui components.

 Args:
 overwrite: If True, overwrite existing components

 Returns:
 Tuple of (success, message)
 """
 if not self.check\_shadcn\_config():
 return (
 False,
 "shadcn not initialized. Run 'npx shadcn@latest init' first",
 )

 cmd = \["npx", "shadcn@latest", "add", "--all"\]

 if overwrite:
 cmd.append("--overwrite")

 if self.dry\_run:
 return True, f"Would run: {' '.join(cmd)}"

 try:
 result = subprocess.run(
 cmd,
 cwd=self.project\_root,
 capture\_output=True,
 text=True,
 check=True,
 )

 success\_msg = "Successfully added all components"
 if result.stdout:
 success\_msg += f"\\n\\nOutput:\\n{result.stdout}"

 return True, success\_msg

 except subprocess.CalledProcessError as e:
 error\_msg = f"Failed to add all components: {e.stderr or e.stdout or str(e)}"
 return False, error\_msg
 except FileNotFoundError:
 return False, "npx not found. Ensure Node.js is installed"

 def list\_installed(self) -> tuple\[bool, str\]:
 """
 List installed components.

 Returns:
 Tuple of (success, message with component list)
 """
 if not self.check\_shadcn\_config():
 return False, "shadcn not initialized"

 installed = self.get\_installed\_components()

 if not installed:
 return True, "No components installed"

 return True, f"Installed components:\\n" + "\\n".join(f" - {c}" for c in sorted(installed))

def main():
 """CLI entry point."""
 parser = argparse.ArgumentParser(
 description="Add shadcn/ui components to your project",
 formatter\_class=argparse.RawDescriptionHelpFormatter,
 epilog="""
Examples:
 # Add single component
 python shadcn\_add.py button

 # Add multiple components
 python shadcn\_add.py button card dialog

 # Add all components
 python shadcn\_add.py --all

 # Overwrite existing components
 python shadcn\_add.py button --overwrite

 # Dry run (show what would be done)
 python shadcn\_add.py button card --dry-run

 # List installed components
 python shadcn\_add.py --list
 """,
 )

 parser.add\_argument(
 "components",
 nargs="\*",
 help="Component names to add (e.g., button, card, dialog)",
 )

 parser.add\_argument(
 "--all",
 action="store\_true",
 help="Add all available components",
 )

 parser.add\_argument(
 "--overwrite",
 action="store\_true",
 help="Overwrite existing components",
 )

 parser.add\_argument(
 "--dry-run",
 action="store\_true",
 help="Show what would be done without executing",
 )

 parser.add\_argument(
 "--list",
 action="store\_true",
 help="List installed components",
 )

 parser.add\_argument(
 "--project-root",
 type=Path,
 help="Project root directory (default: current directory)",
 )

 args = parser.parse\_args()

 # Initialize installer
 installer = ShadcnInstaller(
 project\_root=args.project\_root,
 dry\_run=args.dry\_run,
 )

 # Handle list command
 if args.list:
 success, message = installer.list\_installed()
 print(message)
 sys.exit(0 if success else 1)

 # Handle add all command
 if args.all:
 success, message = installer.add\_all\_components(overwrite=args.overwrite)
 print(message)
 sys.exit(0 if success else 1)

 # Handle add specific components
 if not args.components:
 parser.print\_help()
 sys.exit(1)

 success, message = installer.add\_components(
 args.components,
 overwrite=args.overwrite,
 )

 print(message)
 sys.exit(0 if success else 1)

if \_\_name\_\_ == "\_\_main\_\_":
 main()