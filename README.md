# Classic Mac OS (System 1) Web DeskTop
A classsic/ retro based os. This is the System 1 Macintosh layout and icons and some feature represent the real Mactoish layoput and feature and some are implemented by me. Made with HTML,CSS,Tailwind and `system.css`. This project represent a basic Virtual 
Machine looklike. Demo File is provided if you get lost.

*(Note: Username: admin , Password: 1234)*

*(Note: A "Demo" file is provided right on the desktop in case you get lost!)*

*(Note: Internet is must as System.CSS and Tailwind.CSS uses api)*

## Features

* **Boot Animation:** Features a nostalgic loading sequence when you first open the page.
* **Draggable Windows:** Grab any window by its title bar to freely move it around the screen.
* **Resize Windows:** Features a resize button that toggles the window between full-screen mode and a fixed, centered default size.
* **Close Windows:** A close button is provided at the top-left of the title bar to shut the active window.
* **Editable Files:** Files created by the user act as text editors and can be typed in (default system files are read-only).
* **Create New Files:** Generate your own files via the menu bar (`File -> New File`), type a name, and hit create.
* **Open Files:** Open existing files via `File -> Open`. You can either click the icon in the open window or type the file's exact name (case-sensitive) in the input box.
* **Close Active Tab:** Shut down the last window you clicked on by going to `File -> Close`.
* **Close All Tabs:** Instantly clear your screen of all open windows via `File -> Close All`.
* **Delete Current:** Moves the currently active (last clicked) window directly into the trash (`File -> Delete Current`).
* **Print:** Send the contents of the last clicked file to your printer via `File -> Print`. (Note: Only files can be printed, folders cannot).
* **Rename Files:** Simply double-click the text label beneath an icon to rename it.
* **Icon Collision & Dragging:** Click and drag desktop icons anywhere. If an icon collides with another one, it will automatically snap back to its original position.
* **Drag-and-Drop to Trash:** You can physically drag file icons over the Trash to delete them. *(Easter Egg: If you try to drag the System folder into the trash, your entire browser tab will close!)*
* **Restore Files:** Easily recover deleted files by opening the Trash and double-clicking the trashed files inside.
* **Sort by Name:** When a folder is open, navigate to `View -> Sort by Name` to organize its contents in alphabetical order.
* **Sort by Kind:** When a folder is open, navigate to `View -> Sort by Kind` to group the contents logically (folders first, then files).
* **Special Portfolio Menu:** Click the `Special` tab in the top menu bar and select my name. This opens a dedicated interactive portfolio containing different sections (About, Projects, Skills, etc.) that you can navigate via buttons.
* **Music Player:** Opem the default "Player" folder to upload your own local audio files. Double-clicking tracks opens a media player with play/pause controls, a scrubbable progress slider, and duration tracking.

* **Custom Context Menu:** Right-click anywhere on the empty desktop to instantly bring up a retro menu to create new files, new folders, or open existing ones.

* **Keyboard Shortcuts:** Use quick `Ctrl` ot `Cmd` keybinds for common actions (`M` = New File,`F`= New Folder,`O` = Open, `Q` = Close, `E` = Close All, `V` = About Me,`D`= Did You Know).

* **Mac OS Trivia(Did You Know):** Acess retro trivia dialog via the menu bar.(Easter egg : Clicking the masscot in the trivia box repeatedly triggers a secret "anger" response).
* **Simulated Virus Effect:** A fun visual glitch and "system anomaly" sequence that triggers shortly after completing or skipping the tutorial.
* **Live Clock & Date:** A real-time clock located in the top menu bar that reveals the full day and date when hovered over with the cursor.
* **FullScreen Toggle:** Double-click the top navigation bar to easily toggle your browser in and out of full-screen mode.

## Installation and Setup

Since this project uses vanilla web technologies, there is no need to install any local npm packages. You only need an active internet connection so the browser can load Tailwind CSS and `system.css` via their CDNs.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/VIKRAM2605/macos-system1-clone.git
   ```

2. **Run the project:**
   Simply open the folder in your code editor and run it using a **Live Server** extension (like the one in VS Code) to view the website in your browser.