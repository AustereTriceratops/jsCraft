import React, { useEffect } from 'react';

import { Store } from '././perlinScene';

function App() {
  useEffect( () => {
    const store = new Store();
  
    store.animate();
  });

  return;
}

export default App;
