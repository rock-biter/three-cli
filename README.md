# Create Three

Create Three is an NPX command created with the aim of speeding up the creation and scaffolding of projects with three.js

The aim is to create a starting point for all 3D web projects by creating a basic scene with all the main features that projects of this type normally need.

With a simple command it is possible to create a basic project in vanilla js (in the future also with react-three-fiber) being able to select various functions and types of elements to insert into the scene.

- [Create Three](#create-three)
  - [Basic Usage](#basic-usage)
  - [Options](#options)
    - [--name](#--name)
  - [Wizard Questions](#wizard-questions)
  - [How It Works](#how-it-works)
- [Next steps](#next-steps)

### Basic Usage

```bash
npx create-3
```

This command will start a short wizard that will create you project in a few steps

#### Options

#### --name

Specify the project name

```bash
npx create-3 --name <NAME>
```

Or

```bash
npx create-3 -n <NAME>
```

This will create a new folder where all project files will be created. You can use . to create project in the current folder.

---

#### Wizard Questions

#### Project name

Insert the name of the project. Asked only if --name option is omitted when command is launched.

#### Framework

Select an option
Choose one between Vanilla and React Three Fiber.

#### Camera

What camera do you want to use?
Choose one between Perspective Camera and Orthographic camera.

#### Lights

Choose all the lights you need:
You can use multiple selection to select the lights you want in the scene.
Values: AmbientLight, DirectionalLight

---

#### How it works

Under the hood this command create a new vite project using this command

```bash
npm create vite@latest <NAME> -- --template vanilla
```

It install all this dependencies:

- three
- gsap
- lil-gui

and also this dev-dependencies:

- tailwindcss
- postcss
- autoprefixer

Finally it replace style.css and main.js content and create this files:

- tailwind.config.js
- postcss.config.js

---

### Next steps

This is a list of functionalities that i want to add to this command in the next future:

- Add different type of Camera Constrols
- Add Helpers
- Select dependencies: gsap, tailwindscss, gui, ...
- Add PostProcessing
- Add physics: Rapier, Cannon
- Add more options: --camera, --controls, physics
- Add Svelte + Threlte starter
- ...
