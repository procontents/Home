# Simple TeraBox Links Website

This is a basic static website that displays TeraBox links as clickable boxes, loaded from `links.txt`.

## How to Use

1. **Edit `links.txt`**
   - Add your links in the format:
     ```
     File.No:1  Title: My_Title link:https://terabox.com/s/your-link
     ```
   - Use underscores (`_`) for spaces in the title.

2. **Run a Local Server**
   - Open a terminal in this folder and run:
     ```
     python3 -m http.server 8000
     ```
   - Or, if you have Node.js:
     ```
     npx serve .
     ```
   - This is required for the website to fetch `links.txt`.

3. **Open the Website**
   - Go to [http://localhost:8000](http://localhost:8000) in your browser.
   - The website will show boxes for each link in `links.txt`.
   - Use the search bar to filter links.

4. **Live Updates**
   - When you edit and save `links.txt`, refresh the page to see new links.
