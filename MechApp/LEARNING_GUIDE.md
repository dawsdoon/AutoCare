# Learning Guide: Building Your Landing Page

## Overview
You're going to build a landing page for AutoCare! This guide will help you understand what to do without giving you the exact answers.

## Step 1: Create the Home Component (Home.jsx)

### What You Need to Know:
1. **Imports**: Look at other pages (like `Login.jsx` or `Dashboard.jsx`) to see what they import
2. **Navigation**: React Router provides a `useNavigate` hook - check how `Dashboard.jsx` uses it
3. **Component Structure**: Your component should return JSX wrapped in a main container div

### Key Concepts:
- **Functional Components**: Modern React uses arrow functions like `const Home = () => { }`
- **JSX**: HTML-like syntax that React uses. Remember: className instead of class, self-closing tags need `/`
- **Event Handlers**: Use `onClick={functionName}` to handle button clicks
- **Comments in JSX**: Use `{/* comment */}` syntax

### What to Build:
1. Hero section with headline, subtitle, and "Get Started" button
2. Services preview showing available services
3. Features section highlighting benefits
4. Final call-to-action section
5. Simple footer

### Hints:
- Look at `Dashboard.jsx` to see what services exist
- Check `Login.jsx` to see how navigation works
- Use Font Awesome icons like other components do (e.g., `fa-car`, `fa-calendar-check`)

## Step 2: Style Your Page (Home.css)

### What You Need to Know:
1. **CSS Grid**: Use `display: grid` and `grid-template-columns` for responsive layouts
2. **Flexbox**: Use `display: flex` to center content and align items
3. **Gradients**: Check `index.css` for gradient examples
4. **Colors**: Your theme uses `#4a9eff` (blue) and `#667eea` (purple)

### Key Concepts:
- **Responsive Design**: Use `@media` queries to adjust styles for mobile
- **Hover Effects**: Use `:hover` pseudo-class to add interactivity
- **CSS Variables**: You could use these, but regular colors work fine too

### What to Style:
1. Hero section with gradient background
2. Service cards in a grid layout
3. Feature items
4. Buttons with hover effects
5. Make it responsive for mobile

### Hints:
- Look at `Login.css` for input and button styling examples
- Check `Dashboard.css` for card and grid examples
- Use `max-width` and `margin: 0 auto` to center containers

## Step 3: Update Routing (App.jsx)

### What You Need to Do:
1. Import your new `Home` component at the top
2. Change the route for `"/"` to show `<Home />` instead of `<Login />`
3. Add a new route for `"/login"` that shows `<Login />`

### Key Concepts:
- **React Router**: Routes match URLs to components
- **Route Order**: More specific routes should come before general ones
- **Default Route**: `"/"` is the home page URL

### Hints:
- Look at how other components are imported
- The route structure is: `<Route path="/url" element={<Component />} />`

## Testing Your Work

1. Start your dev server: `npm run dev`
2. Visit `http://localhost:5173/` (or whatever port Vite uses)
3. You should see your landing page
4. Click "Get Started" - it should take you to the login page
5. Test on mobile by resizing your browser

## Common Mistakes to Avoid

1. **Forgetting to export**: Make sure you have `export default Home` at the bottom
2. **Wrong import path**: Check that your import path matches your file location
3. **CSS not loading**: Make sure you import the CSS file in your JSX
4. **Navigation not working**: Make sure you're calling `navigate('/login')` not just `'/login'`

## Resources to Reference

- Look at existing components for patterns:
  - `Login.jsx` - for form structure and navigation
  - `Dashboard.jsx` - for service data and card layouts
  - `Login.css` - for button and input styling
  - `Dashboard.css` - for grid layouts

## Questions to Ask Yourself

- Does my component export correctly?
- Are all my imports correct?
- Does navigation work when I click buttons?
- Does the page look good on mobile?
- Are my classNames matching between JSX and CSS?

Good luck! You've got this! 🚀

