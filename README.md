# PV Structure Pro

Create a professional web application called Solar Structural Design Platform.



This is an engineering software platform for automated design of solar PV mounting structures and foundations.



IMPORTANT:



- This is NOT a simple marketing website.

- It must be designed as a real modular engineering application.

- Do NOT implement engineering equations or structural calculations yet.

- Use realistic mock engineering data for now.

- The architecture must allow independent engineering engines to be added later without rebuilding the application.



TECHNOLOGY



Use:



- React

- TypeScript

- Tailwind CSS

- Modern responsive UI

- Three.js / React Three Fiber for the future 3D viewer

- Modular component architecture



Organize the application so that individual modules can be modified independently.



Create a clear architecture similar to:



src/

components/

pages/

modules/

engines/

data/

types/

utils/



The future engineering engines will include:



- Input Engine

- Panel Library Engine

- Array/Layout Engine

- Geometry Engine

- Load Engine

- Steel Design Engine

- Connection Engine

- Foundation Engine

- Rebar Engine

- Anchor Bolt Engine

- Base Plate Engine

- 3D Engine

- Drawing Engine

- BOM Engine

- Report Engine



Do not implement their calculations yet. Create clean interfaces/placeholders for them.



---



APPLICATION STRUCTURE



Create the following main screens:



1. Dashboard

2. New Project

3. Project Information

4. Solar Array

5. Layout Selection

6. Structure Preview

7. Design Generation

8. Design Results

9. 3D Model

10. Drawings

11. BOM

12. Engineering Report

13. Project Settings



Use a left sidebar navigation on desktop.



The interface should look like professional engineering software such as structural analysis/design software, not like a generic SaaS landing page.



---



DASHBOARD



Create a professional dashboard containing:



- New Project button

- Recent Projects

- Project status

- Project type

- Number of PV panels

- Last modified date

- Design status



Example projects may be shown using mock data.



---



NEW PROJECT



When the user clicks "New Project", show project type selection.



Project types:



- Ground Structure

- Elevated Rooftop

- Metal/Zinc Roof

- Carport



Only Ground Structure should be active initially.



The other types should appear as:



"Coming Soon"



---



PROJECT INFORMATION



For the initial Ground Structure project, ask only:



Project Name



Governorate



Governorate must be selected from a dropdown containing the 22 governorates of Yemen:



- Amanat Al Asimah

- Abyan

- Ibb

- Al Bayda

- Taiz

- Al Jawf

- Hajjah

- Al Hudaydah

- Hadhramaut

- Dhamar

- Shabwah

- Saada

- Sana’a

- Aden

- Lahij

- Ma’rib

- Al Mahwit

- Raymah

- Socotra

- Ad Dali’

- Amran

- Al Mahrah



Do NOT add a map or coordinates.



---



SOLAR ARRAY



Create an input screen with:



Number of PV Panels



Panel Selection:



- 580 W

- 650 W

- 770 W



The panel selection must come from a centralized Panel Library.



Do NOT ask the user for panel dimensions.



Create a mock panel library structure containing:



- Power

- Length

- Width

- Thickness

- Weight

- Frame dimensions

- Mounting/clamping information



Use placeholder values for dimensions for now and clearly mark them as mock data.



The real values will be added later.



Also include:



Available Area



- Width

- Length



---



ARRAY LAYOUT ENGINE



Create a layout selection screen.



The system should automatically generate possible PV array layouts based on:



- Number of panels

- Selected panel

- Available area



For example, if the user enters 48 panels, display several possible configurations such as:



2 × 6 × 4

3 × 4 × 4

4 × 3 × 4



These are examples only.



Do NOT implement the engineering algorithm yet.



Use mock layout results.



Each layout should be displayed visually.



Allow the user to select one layout.



---



STRUCTURE PREVIEW



After selecting a layout, show a professional engineering preview.



Display:



- PV panels

- Steel mounting structure

- Columns

- Rafters

- Purlins

- Foundations



Create a simplified 3D preview.



The 3D viewer must support:



- Rotate

- Zoom

- Pan



Add visibility controls:



☑ PV Panels

☑ Steel Structure

☑ Foundations

☐ Reinforcement

☐ Anchor Bolts

☐ Base Plates



These will later connect to the actual 3D Engine.



---



DESIGN GENERATION



Create a "Generate Design" button.



For now, clicking it should simulate a design-generation process.



Show stages:



Input Processing

Array Generation

Geometry Generation

Load Calculation

Steel Design

Connection Design

Foundation Design

Reinforcement Design

Anchor Bolt Design

3D Model Generation

Drawing Generation

BOM Generation

Report Generation



For now use mock progress/status.



IMPORTANT:

Do not pretend these calculations are real yet.



Clearly structure the code so each stage will later call its corresponding engineering engine.



---



DESIGN RESULTS



Create a professional results dashboard.



Display mock engineering results such as:



Project Information

PV Array

Structure Geometry

Steel Members

Foundations

Anchor Bolts

Base Plates

Reinforcement



Use status indicators such as:



Ready

Pending

Not Calculated



Do NOT show fake "PASS" engineering results as if they were real calculations.



---



DRAWINGS



Create a drawing page.



Show placeholders for:



- General Arrangement

- Plan

- Elevation

- Section

- Foundation Detail

- Base Plate Detail

- Anchor Bolt Detail

- Reinforcement Detail



Drawing sheet size:



A3



The actual drawing generation engine will be implemented later.



---



BOM



Create a professional Bill of Materials page.



Columns:



Item

Description

Specification

Quantity

Unit

Remarks



Example mock items:



PV Module

Column

Rafter

Purlin

Base Plate

Anchor Bolt

Concrete Foundation

Rebar



Clearly mark the data as preliminary/mock until the real engineering engines are implemented.



---



ENGINEERING REPORT



Create a report page containing sections:



1. Project Information

2. Design Criteria

3. PV Array

4. Geometry

5. Loads

6. Structural Design

7. Connections

8. Foundation

9. Reinforcement

10. Anchor Bolts

11. Base Plates

12. Drawings

13. BOM



For now these sections contain placeholders.



The final report will later be generated automatically from the engineering engines.



---



DESIGN CONSTANTS



Create a centralized configuration file for initial design constants.



Initial values:



Tilt Angle = 15°

Wind Speed = 38 m/s

Steel Grade = S275

Concrete Grade = C25/30

Rebar Grade = B500

Concrete Cover = 30 mm



Design Codes:



ASCE 7-22

AISC 360-22



Units:



mm

kN

MPa



Drawing Size:



A3



Foundation Type:



Isolated Footing



IMPORTANT:

These are initial system constants.



Do not allow the user to edit them from the normal project input screens.



They must be centralized so they can later be changed by the engineering system.



---



IMPORTANT ARCHITECTURE RULE



The application must use a single parametric project model.



The same project model must eventually drive:



Array

Geometry

Structural Calculations

Foundation

Rebar

Anchor Bolts

Base Plate

3D Model

Drawings

BOM

Engineering Report



For example:



If the number of PV panels changes from 48 to 72, the system architecture must allow all dependent components to update automatically.



Do NOT create independent hard-coded models for each screen.



---



USER EXPERIENCE



The interface should feel like professional engineering software.



Style:



- Clean

- Technical

- Modern

- Professional

- Minimal

- Engineering-focused



Use a dark/white professional engineering UI with clear cards, tables, tabs, status indicators and technical diagrams.



Do not make it look like an AI chatbot.



Do not put an AI chat interface at the center of the application.



The main workflow should be:



Dashboard

→ New Project

→ Project Information

→ Solar Array

→ Layout Selection

→ 3D Preview

→ Generate Design

→ Results

→ Drawings

→ BOM

→ Engineering Report



Build the complete UI navigation and mock workflow now.



Do not implement real engineering calculations yet.

Do not invent engineering results.

Do not use AI to perform structural design calculations.



The goal of this first version is to establish the complete professional software interface and modular architecture for the future engineering engines.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/18558713-5715-4760-a476-7e8b8acdf6dd).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
