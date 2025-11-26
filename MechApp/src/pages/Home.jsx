/* ============================================
   LEARNING NOTES (for study purposes)
   ============================================
   - Lines starting with "LEARNING:" are educational comments
   - Actual code appears on lines without "LEARNING:" prefix
   - Study the LEARNING comments to understand concepts
   ============================================ */

/* ============================================
   COMPONENT OVERVIEW: Home.jsx
   ============================================
   PURPOSE: This is the landing page component for the AutoCare application.
            It serves as the first page visitors see when they visit the website.
   
   STRUCTURE:
   1. Hero Section - Large banner with main headline and call-to-action button
   2. Services Preview - Grid of service cards showing available services
   3. Features Section - Highlights benefits of using AutoCare
   4. Call-to-Action Section - Final push to encourage sign-up
   5. Footer - Copyright and basic information
   
   KEY FUNCTIONS:
   - handleGetStarted(): Navigates user to the login page when CTA buttons are clicked
   
   REACT CONCEPTS USED:
   - Functional Component: Modern React component using arrow function syntax
   - React Router: useNavigate hook for programmatic navigation
   - JSX: JavaScript XML syntax for creating HTML-like structures
   - Event Handlers: onClick handlers for button interactions
   - CSS Modules: Styling via imported CSS file
   ============================================ */

// LEARNING: Import React - React is the core library that allows us to create components and use JSX
// LEARNING: React provides the Component class, hooks, and JSX transformation
// LEARNING: useState is a React Hook that lets us manage component state (like dropdown menu open/closed)
// LEARNING: useEffect is a React Hook that lets us perform side effects (like closing menu when clicking outside)
import React, { useState, useEffect } from 'react'

// LEARNING: Import useNavigate hook from react-router-dom - this hook gives us a function to programmatically navigate to different routes
// LEARNING: useNavigate is a React Router hook that returns a navigate function we can call to change pages
import { useNavigate } from 'react-router-dom' // this allows you to navigate to different pages using the useNavigate hook
import './Home.css'

// LEARNING: Create a functional component called Home
// LEARNING: Functional components are the modern way to write React components (preferred over class components)
// LEARNING: Arrow function syntax: const ComponentName = () => { return JSX }
// LEARNING: This component will render our landing page
const Home = () => {
  /* ============================================
     STATE: Dropdown Menu
     ============================================
     PURPOSE: Manages whether the dropdown menu is open or closed.
     
     HOW IT WORKS:
     - useState(false) creates state with initial value of false (menu closed)
     - isMenuOpen is the current state value
     - setIsMenuOpen is the function to update the state
     - When user clicks menu button, we toggle isMenuOpen
     ============================================ */
  // LEARNING: useState hook to manage dropdown menu state
  // LEARNING: false means menu is closed by default
  // LEARNING: isMenuOpen holds the current state (true = open, false = closed)
  // LEARNING: setIsMenuOpen is the function to update the state
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  /* ============================================
     HOOK: useNavigate
     ============================================
     PURPOSE: This React Router hook gives us a function to programmatically navigate between pages.
     
     HOW IT WORKS:
     1. useNavigate() is called at the top of the component (must be called unconditionally)
     2. It returns a navigate function that we can use to change routes
     3. We store this function in a constant so we can call it later
     4. When we call navigate('/path'), React Router changes the route
     
     IMPORTANT RULES:
     - Must be called at the top level of the component (not inside if statements)
     - Must be called in the same order every render (React Hook rules)
     - The navigate function persists across re-renders
     
     USAGE EXAMPLE:
     navigate('/login')        // Navigate to login page
     navigate('/dashboard')    // Navigate to dashboard
     navigate(-1)              // Go back one page in history
     ============================================ */
  // LEARNING: Set up navigation functionality using the useNavigate hook
  // LEARNING: useNavigate() is a React Hook - it must be called at the top level of the component
  // LEARNING: Hooks are special functions that let you "hook into" React features
  // LEARNING: useNavigate() is called inside the component and returns a navigate function
  // LEARNING: We store this function in a constant called 'navigate' so we can use it later
  // LEARNING: This function can be called with a route path (string) to navigate to that page
  // LEARNING: Example: navigate('/login') will navigate to the login page
  // LEARNING: The navigate function is provided by React Router and is connected to your App.jsx routes
// useNavigate() is a react hook - it must be called at the top level of the component, hooks are special functions that let you hook into react features
// useNavigate() is called inside the component and returns a navigate function ex: navigate('/login') will navigate to the login page

  const navigate = useNavigate()
  
  /* ============================================
     FUNCTION: handleGetStarted
     ============================================
     PURPOSE: This function handles the click event on "Get Started" and "Login or Sign Up" buttons.
              It programmatically navigates the user to the login page.
     
     HOW IT WORKS:
     1. When a button with onClick={handleGetStarted} is clicked, this function is called
     2. It calls navigate('/login') which is a function from React Router
     3. React Router changes the URL to '/login' and renders the Login component
     4. The user sees the login page instead of the home page
     
     WHY WE NEED IT:
     - Provides a way to navigate without using <Link> components
     - Allows us to trigger navigation from button clicks
     - Keeps navigation logic centralized in one function
     ============================================ */
  // LEARNING: Create a function that handles the "Get Started" button click
  // LEARNING: This is an arrow function that will be called when the button is clicked
  // LEARNING: Arrow function syntax: const functionName = () => { code }
  // LEARNING: When called, it executes navigate('/login') which tells React Router to navigate to the /login route
  // LEARNING: The navigate function is provided by React Router and changes the URL, which triggers the route change
  // LEARNING: This function is reusable - we can call it from multiple buttons (hero button and CTA button)
  const handleGetStarted = () => {
    // LEARNING: navigate() is a function from React Router that programmatically changes the route
    // LEARNING: It's similar to clicking a link, but done programmatically in JavaScript
    // LEARNING: Pass it a string with the path you want to navigate to (must match a route in App.jsx)
    // LEARNING: The path '/login' must be defined as a route in App.jsx for this to work
    // LEARNING: This will cause React Router to:
    //   1. Change the URL in the browser to '/login'
    //   2. Render the component associated with '/login' route
    //   3. Unmount the Home component and mount the Login component
    navigate('/login')
  }

  /* ============================================
     FUNCTION: handleNavigateToFAQ
     ============================================
     PURPOSE: Navigates the user to the FAQ page when they click the FAQ link in the footer.
     ============================================ */
  // LEARNING: Function to navigate to FAQ page
  // LEARNING: Similar to handleGetStarted, but navigates to '/faq' instead
  const handleNavigateToFAQ = () => {
    // LEARNING: Navigate to the FAQ page route
    navigate('/faq')
  }

  /* ============================================
     FUNCTION: handleNavigateToContact
     ============================================
     PURPOSE: Navigates the user to the Contact page when they click the Contact link in the footer.
     ============================================ */
  // LEARNING: Function to navigate to Contact page
  // LEARNING: Similar to handleGetStarted, but navigates to '/contact' instead
  const handleNavigateToContact = () => {
    // LEARNING: Navigate to the Contact page route
    navigate('/contact')
  }

  /* ============================================
     FUNCTION: toggleMenu
     ============================================
     PURPOSE: Toggles the dropdown menu open/closed state.
     ============================================ */
  // LEARNING: Function to toggle dropdown menu open/closed
  // LEARNING: When called, it changes isMenuOpen from true to false or vice versa
  const toggleMenu = () => {
    // LEARNING: setIsMenuOpen updates the state to the opposite of current value
    // LEARNING: !isMenuOpen means "not isMenuOpen" - if true, becomes false; if false, becomes true
    setIsMenuOpen(!isMenuOpen)
  }

  /* ============================================
     FUNCTION: closeMenu
     ============================================
     PURPOSE: Closes the dropdown menu.
     ============================================ */
  // LEARNING: Function to close the dropdown menu
  // LEARNING: Sets isMenuOpen to false
  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  /* ============================================
     HOOK: useEffect - Close menu when clicking outside
     ============================================
     PURPOSE: Closes the dropdown menu when user clicks outside of it.
     
     HOW IT WORKS:
     1. useEffect runs after component renders
     2. Adds event listener to document to detect clicks
     3. If click is outside the menu, closes it
     4. Returns cleanup function to remove event listener
     ============================================ */
  // LEARNING: useEffect hook to handle clicking outside the menu
  // LEARNING: This runs after the component renders
  // LEARNING: [isMenuOpen] means it runs when isMenuOpen changes
  useEffect(() => {
    // LEARNING: Function to handle clicks outside the menu
    const handleClickOutside = (event) => {
      // LEARNING: Check if menu is open and click is outside the nav-actions area
      // LEARNING: closest('.home-nav-actions') checks if click was inside the menu area
      if (isMenuOpen && !event.target.closest('.home-nav-actions')) {
        // LEARNING: If click was outside, close the menu
        closeMenu()
      }
    }

    // LEARNING: Add event listener to document to listen for clicks
    document.addEventListener('click', handleClickOutside)
    
    // LEARNING: Return cleanup function - removes event listener when component unmounts
    // LEARNING: This prevents memory leaks
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isMenuOpen]) // LEARNING: Dependency array - effect runs when isMenuOpen changes
  
  /* ============================================
     JSX RETURN STATEMENT
     ============================================
     PURPOSE: Returns the JSX (JavaScript XML) that defines the structure and content of the page.
     
     WHAT IS JSX?
     - JSX looks like HTML but is actually JavaScript
     - It gets compiled/transformed into React.createElement() calls by the build tool (Vite)
     - Allows us to write HTML-like syntax in JavaScript
     
     JSX RULES:
     1. Must return a single parent element (or React Fragment <></>)
     2. Use className instead of class (class is a reserved word in JavaScript)
     3. Use camelCase for event handlers (onClick, not onclick)
     4. Self-closing tags must have /> (e.g., <i /> not <i>)
     5. JavaScript expressions go in curly braces: {variableName}
     
     STRUCTURE:
     - Outer div with className="home-page" wraps all content
     - Contains multiple <section> elements for different page sections
     - Each section has semantic HTML5 elements for accessibility
     ============================================ */
  // LEARNING: Return JSX that creates the landing page structure
  // LEARNING: JSX (JavaScript XML) looks like HTML but is actually JavaScript
  // LEARNING: It gets compiled to React.createElement calls by Vite during build
  // LEARNING: The return statement must return a single parent element (or React Fragment)
  // LEARNING: className is used instead of class (because 'class' is a reserved word in JavaScript)
  // LEARNING: The parentheses () allow us to write JSX across multiple lines for readability
  return (
  // LEARNING: Main container div - wraps all page content
  // LEARNING: className="home-page" applies styles from Home.css
  // LEARNING: This div is the single parent element required by React
  <div className="home-page">
      {/* LEARNING: NAVBAR - Navigation bar at the top of the page */}
      {/* LEARNING: This provides navigation links via a dropdown menu */}
      <nav className="home-navbar">
        {/* LEARNING: Logo/Title section - clickable to go to home */}
        <div 
          className="home-nav-logo" 
          role="button" 
          tabIndex={0}
          onClick={() => navigate('/')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              navigate('/')
            }
          }}
          style={{ cursor: 'pointer' }}
        >
          {/* LEARNING: Font Awesome car icon - represents AutoCare */}
          <i className="fas fa-car"></i>
          {/* LEARNING: AutoCare title/logo text */}
          <h1>AutoCare</h1>
        </div>
        
        {/* LEARNING: Navigation actions container - holds the dropdown menu */}
        <div className="home-nav-actions">
          {/* LEARNING: Menu toggle button - opens/closes the dropdown */}
          {/* LEARNING: onClick calls toggleMenu to open/close the menu */}
          <button className="home-menu-toggle" onClick={toggleMenu}>
            {/* LEARNING: Font Awesome bars icon - hamburger menu icon */}
            <i className="fas fa-bars"></i>
          </button>
          
          {/* LEARNING: Dropdown menu - shows navigation links */}
          {/* LEARNING: className includes 'show' when isMenuOpen is true */}
          {/* LEARNING: This controls visibility via CSS */}
          <div className={`home-dropdown-menu ${isMenuOpen ? 'show' : ''}`}>
            {/* LEARNING: Home link - navigates back to home page */}
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); closeMenu(); }} className="home-dropdown-item">
              <i className="fas fa-home"></i>
              Home
            </a>
            
            {/* LEARNING: FAQ link - navigates to FAQ page */}
            <a href="#" onClick={(e) => { e.preventDefault(); handleNavigateToFAQ(); closeMenu(); }} className="home-dropdown-item">
              <i className="fas fa-question-circle"></i>
              FAQ
            </a>
            
            {/* LEARNING: Contact link - navigates to Contact page */}
            <a href="#" onClick={(e) => { e.preventDefault(); handleNavigateToContact(); closeMenu(); }} className="home-dropdown-item">
              <i className="fas fa-phone"></i>
              Contact Us
            </a>
            
            {/* LEARNING: Login link - navigates to Login page */}
            <a href="#" onClick={(e) => { e.preventDefault(); handleGetStarted(); closeMenu(); }} className="home-dropdown-item">
              <i className="fas fa-sign-in-alt"></i>
              Login / Sign Up
            </a>
          </div>
        </div>
      </nav>
      
      {/* LEARNING: HERO SECTION - The big banner at the top of the page */}
      {/* LEARNING: This is a semantic HTML5 <section> element - good for accessibility and SEO */}
      {/* LEARNING: className="hero-section" will be styled in Home.css */}
      <section className="hero-section">
        {/* LEARNING: Container div for hero content - helps center and constrain the width of content */}
        {/* LEARNING: This is a common pattern: section > container > content */}
        <div className="hero-content">
          {/* LEARNING: Main headline - h1 is the most important heading on the page */}
          {/* LEARNING: This is what visitors see first - make it compelling */}
          {/* LEARNING: The <span> with className="highlight" allows us to style part of the text differently */}
          <h1 className="hero-title">
            Professional Auto Care
            {/* LEARNING: span is an inline element - we can style just this part differently */}
            {/* LEARNING: The highlight class will make this text a different color (see Home.css) */}
            <span className="highlight"> Made Simple</span>
          </h1>
          
          {/* LEARNING: Subtitle/description paragraph - explains what the service does */}
          {/* LEARNING: This provides context and information about AutoCare */}
          {/* LEARNING: className="hero-subtitle" will be styled differently from regular paragraphs */}
          <p className="hero-subtitle">
            Schedule appointments, track maintenance, and keep your vehicle running smoothly. 
            All in one convenient platform.
          </p>
          
          {/* LEARNING: Call-to-action button - encourages users to sign up/login */}
          {/* LEARNING: onClick is a React event handler - when clicked, it calls handleGetStarted function */}
          {/* LEARNING: className="cta-button" applies button styles from Home.css */}
          {/* LEARNING: The button contains text and an icon */}
          <button className="cta-button" onClick={handleGetStarted}>
            Get Started
            {/* LEARNING: Font Awesome icon - adds a visual arrow to indicate action */}
            {/* LEARNING: className="fas fa-arrow-right" is Font Awesome syntax for an arrow icon */}
            {/* LEARNING: The icon appears after the text */}
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </section>

      {/* LEARNING: SERVICES PREVIEW SECTION - Shows visitors what services are available */}
      {/* LEARNING: This section displays the services AutoCare offers */}
      <section className="services-preview">
        {/* LEARNING: Container div - centers content and limits width on large screens */}
        <div className="container">
          {/* LEARNING: Section heading - h2 is a secondary heading */}
          {/* LEARNING: This tells users what this section is about */}
          <h2 className="section-title">Our Services</h2>
          
          {/* LEARNING: Section subtitle - provides more context */}
          {/* LEARNING: className="section-subtitle" will be styled as a lighter, smaller text */}
          <p className="section-subtitle">Comprehensive automotive care for your vehicle</p>
          
          {/* LEARNING: Services grid - displays service cards in a responsive grid layout */}
          {/* LEARNING: className="services-grid" will use CSS Grid to arrange cards */}
          {/* LEARNING: Grid automatically adjusts number of columns based on screen size */}
          <div className="services-grid">
            
            {/* LEARNING: Individual service card - each service gets its own card */}
            {/* LEARNING: This is the Oil Change service card */}
            <div className="service-card">
              {/* LEARNING: Icon container - wraps the Font Awesome icon */}
              {/* LEARNING: className="service-icon" styles it as a circular icon container */}
              <div className="service-icon">
                {/* LEARNING: Font Awesome oil can icon - visual representation of oil change service */}
                {/* LEARNING: fa-oil-can is the specific icon name from Font Awesome library */}
                <i className="fas fa-oil-can"></i>
              </div>
              {/* LEARNING: Service name - h3 is a tertiary heading (less important than h2) */}
              <h3>Oil Change</h3>
              {/* LEARNING: Service description - explains what this service includes */}
              <p>Regular engine oil replacement and filter change</p>
            </div>

            {/* LEARNING: Brake Inspection service card - second service in the grid */}
            {/* LEARNING: Same structure as Oil Change card: icon container, heading, description */}
            <div className="service-card">
              {/* LEARNING: Icon container with circular styling */}
              <div className="service-icon">
                {/* LEARNING: Font Awesome circle-notch icon - represents brake/rotating parts */}
                <i className="fas fa-circle-notch"></i>
              </div>
              {/* LEARNING: Service name heading */}
              <h3>Brake Inspection</h3>
              {/* LEARNING: Service description paragraph */}
              <p>Complete brake system check and pad replacement</p>
            </div>

            {/* LEARNING: Tire Rotation service card - third service in the grid */}
            <div className="service-card">
              {/* LEARNING: Icon container */}
              <div className="service-icon">
                {/* LEARNING: Font Awesome sync-alt icon - represents rotation/movement */}
                <i className="fas fa-sync-alt"></i>
              </div>
              {/* LEARNING: Service name */}
              <h3>Tire Rotation</h3>
              {/* LEARNING: Service description */}
              <p>Rotate tires for even wear and extend tire life</p>
            </div>

            {/* LEARNING: Flat Tire Repair service card - fourth service in the grid */}
            <div className="service-card">
              {/* LEARNING: Icon container */}
              <div className="service-icon">
                {/* LEARNING: Font Awesome tools icon - represents repair/maintenance work */}
                <i className="fas fa-tools"></i>
              </div>
              {/* LEARNING: Service name */}
              <h3>Flat Tire Repair</h3>
              {/* LEARNING: Service description */}
              <p>Professional tire patching and repair services</p>
            </div>

            {/* LEARNING: Wheel Alignment service card - fifth service in the grid */}
            <div className="service-card">
              {/* LEARNING: Icon container */}
              <div className="service-icon">
                {/* LEARNING: Font Awesome cog icon - represents mechanical adjustment/alignment */}
                <i className="fas fa-cog"></i>
              </div>
              {/* LEARNING: Service name */}
              <h3>Wheel Alignment</h3>
              {/* LEARNING: Service description */}
              <p>Precise wheel alignment for optimal handling and tire wear</p>
            </div>

            {/* LEARNING: Seasonal Tire Change service card - sixth and final service in the grid */}
            <div className="service-card">
              {/* LEARNING: Icon container */}
              <div className="service-icon">
                {/* LEARNING: Font Awesome snowflake icon - represents seasonal/winter tires */}
                <i className="fas fa-snowflake"></i>
              </div>
              {/* LEARNING: Service name */}
              <h3>Seasonal Tire Change</h3>
              {/* LEARNING: Service description */}
              <p>Switch between summer and winter tires seasonally</p>
            </div>
          </div>
        </div>
      </section>

      {/* LEARNING: FEATURES/BENEFITS SECTION - Highlights why users should use AutoCare */}
      {/* LEARNING: This section explains the benefits of using the platform */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose AutoCare?</h2>
          
          {/* LEARNING: Features grid - displays feature items in a grid layout */}
          <div className="features-grid">
            
            {/* LEARNING: Individual feature item - Easy Scheduling */}
            <div className="feature-item">
              {/* LEARNING: Feature icon container */}
              <div className="feature-icon">
                {/* LEARNING: Font Awesome calendar-check icon - represents scheduling */}
                <i className="fas fa-calendar-check"></i>
              </div>
              {/* LEARNING: Feature title */}
              <h3>Easy Scheduling</h3>
              {/* LEARNING: Feature description */}
              <p>Book appointments online at your convenience</p>
            </div>

            {/* LEARNING: Service History feature item - second feature in the grid */}
            {/* LEARNING: Same structure as Easy Scheduling: icon, heading, description */}
            <div className="feature-item">
              {/* LEARNING: Feature icon container */}
              <div className="feature-icon">
                {/* LEARNING: Font Awesome history icon - represents past records/tracking */}
                <i className="fas fa-history"></i>
              </div>
              {/* LEARNING: Feature title */}
              <h3>Service History</h3>
              {/* LEARNING: Feature description */}
              <p>Keep track of all your vehicle's maintenance records</p>
            </div>

            {/* LEARNING: Reminders feature item - third feature in the grid */}
            <div className="feature-item">
              {/* LEARNING: Feature icon container */}
              <div className="feature-icon">
                {/* LEARNING: Font Awesome bell icon - represents notifications/alerts */}
                <i className="fas fa-bell"></i>
              </div>
              {/* LEARNING: Feature title */}
              <h3>Reminders</h3>
              {/* LEARNING: Feature description */}
              <p>Never miss an appointment with timely notifications</p>
            </div>

            {/* LEARNING: Trusted Service feature item - fourth and final feature in the grid */}
            <div className="feature-item">
              {/* LEARNING: Feature icon container */}
              <div className="feature-icon">
                {/* LEARNING: Font Awesome shield-alt icon - represents security/trust/reliability */}
                <i className="fas fa-shield-alt"></i>
              </div>
              {/* LEARNING: Feature title */}
              <h3>Trusted Service</h3>
              {/* LEARNING: Feature description */}
              <p>Professional mechanics you can rely on</p>
            </div>
          </div>
        </div>
      </section>

      {/* LEARNING: FINAL CALL-TO-ACTION SECTION - Last push to get users to sign up */}
      {/* LEARNING: This section appears at the bottom and encourages final action */}
      <section className="cta-section">
        <div className="container">
          {/* LEARNING: CTA heading - compelling headline to encourage sign-up */}
          <h2>Ready to Get Started?</h2>
          
          {/* LEARNING: CTA description - builds trust and urgency */}
          <p>Join thousands of satisfied customers who trust AutoCare</p>
          
          {/* LEARNING: Large CTA button - prominent button to encourage clicking */}
          {/* LEARNING: onClick calls handleGetStarted which navigates to /login */}
          {/* LEARNING: className="cta-button-large" makes this button larger than the hero button */}
          <button className="cta-button-large" onClick={handleGetStarted}>
            Login or Sign Up
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </section>

      {/* LEARNING: FOOTER - Simple footer with basic information and navigation links */}
      {/* LEARNING: Footer is a semantic HTML5 element - good for accessibility */}
      <footer className="home-footer">
        <div className="container">
          {/* LEARNING: Footer navigation links - allows users to access FAQ and Contact pages */}
          {/* LEARNING: flexbox layout to arrange links horizontally */}
          <div className="footer-links">
            {/* LEARNING: FAQ link - navigates to FAQ page when clicked */}
            {/* LEARNING: onClick handler calls handleNavigateToFAQ function */}
            {/* LEARNING: className="footer-link" styles the link (see Home.css) */}
            <a href="#" onClick={(e) => { e.preventDefault(); handleNavigateToFAQ(); }} className="footer-link">
              {/* LEARNING: Font Awesome question-circle icon - represents FAQ */}
              <i className="fas fa-question-circle"></i>
              FAQ
            </a>
            
            {/* LEARNING: Contact link - navigates to Contact page when clicked */}
            {/* LEARNING: onClick handler calls handleNavigateToContact function */}
            <a href="#" onClick={(e) => { e.preventDefault(); handleNavigateToContact(); }} className="footer-link">
              {/* LEARNING: Font Awesome phone icon - represents contact */}
              <i className="fas fa-phone"></i>
              Contact Us
            </a>
          </div>
          
          {/* LEARNING: Copyright text - &copy; is the HTML entity for the copyright symbol © */}
          {/* LEARNING: This displays as: © 2025 AutoCare. All rights reserved. */}
          <p className="footer-copyright">&copy; 2025 AutoCare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

/* ============================================
   EXPORT STATEMENT
   ============================================
   PURPOSE: Makes this component available to be imported in other files.
   
   HOW IT WORKS:
   - export default means this is the main (default) export from this file
   - Only one default export per file is allowed
   - Other files can import it using: import Home from './pages/Home'
   - The import name (Home) can be different, but it's convention to match
   
   WHERE IT'S USED:
   - App.jsx imports this component to use in routing
   - React Router renders this component when the route matches '/'
   ============================================ */
// LEARNING: Export the component so it can be imported in App.jsx
// LEARNING: export default means this is the main export from this file
// LEARNING: "default" means you can import it with any name, but convention is to use the component name
// LEARNING: When you import Home in App.jsx, you'll write: import Home from './pages/Home'
// LEARNING: The component name (Home) must match what you're importing (or you can rename it)
// LEARNING: This makes the Home component available to other files in your application
export default Home
