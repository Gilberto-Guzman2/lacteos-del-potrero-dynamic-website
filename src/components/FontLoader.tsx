import { useEffect } from 'react';

const FontLoader = () => {
  useEffect(() => {
    // Preload fonts for performance
    const link1 = document.createElement('link');
    link1.rel = 'preload';
    link1.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap';
    link1.as = 'style';
    document.head.appendChild(link1);

    const link2 = document.createElement('link');
    link2.rel = 'preload';
    link2.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap';
    link2.as = 'style';
    document.head.appendChild(link2);

    // Load fonts asynchronously
    const style1 = document.createElement('link');
    style1.rel = 'stylesheet';
    style1.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap';
    document.head.appendChild(style1);

    const style2 = document.createElement('link');
    style2.rel = 'stylesheet';
    style2.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap';
    document.head.appendChild(style2);
  }, []);

  return null;
};

export default FontLoader;