// src/CreativeEditorSDKComponent.js
import './styles.css';
import CreativeEditorSDK from '@cesdk/cesdk-js';
import { useEffect, useRef, useState } from 'react';

// Configuration object for initializing the SDK
const config = {
  license: process.env.REACT_APP_CESDK_LICENSE_KEY, // Use environment variable for license key
  userId: 'guides-user', // User ID for tracking
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.29.0/assets', // Base URL for assets
  theme: 'dark', // Theme setting
  role: 'Creator', // Role setting ('Creator', 'Adopter', 'Viewer')
  callbacks: { onUpload: 'local' } // Configuration to enable local uploads in the asset library
};

export default function CreativeEditorSDKComponent() {
  const cesdk_container = useRef(null); // Create a reference for the container div
  const [cesdk, setCesdk] = useState(null); // Create a state variable for the SDK instance

  useEffect(() => {
    if (!cesdk_container.current) return; // If the container is not available, exit

    let cleanedUp = false; // Flag to handle cleanup
    let instance; // Variable to hold the SDK instance

    // Initialize the CreativeEditorSDK with the container and config
    CreativeEditorSDK.create(cesdk_container.current, config).then(
      async (_instance) => {
        instance = _instance; // Store the instance in the variable

        if (cleanedUp) {
          instance.dispose(); // If component was cleaned up, dispose of the instance
          return;
        }

        // Add default and demo asset sources to the instance
        await Promise.all([
          instance.addDefaultAssetSources(),
          instance.addDemoAssetSources({ sceneMode: 'Design' })
        ]);
        await instance.createDesignScene(); // Create a design scene in the editor

        setCesdk(instance); // Update the state with the instance
      }
    );

    // Cleanup function to dispose of the instance when the component unmounts
    const cleanup = () => {
      cleanedUp = true;
      instance?.dispose();
      setCesdk(null);
    };

    return cleanup; // Return the cleanup function for useEffect
  }, [cesdk_container]); // Dependency array to trigger useEffect on changes

  return (
    <div className="cesdk-container">
      <div ref={cesdk_container} style={{ width: '100%', height: '100%' }}></div>
    </div>
  );
}
