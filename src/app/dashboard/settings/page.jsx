"use client";

import { useState } from "react";

export default function SettingsPage() {

  return (
    <div>
      <header>
        <h1>Settings</h1>
        <p>
          Welcome to the settings page. Here you can manage your account,
          preferences, privacy, and other important configurations.
        </p>
      </header>

      <hr />

      <section>
        <h2>1. Profile Settings</h2>
        <p>
          Update your personal information such as your full name,
          email address, and contact details.
        </p>

        <ul>
          <li>Change full name</li>
          <li>Update email address</li>
          <li>Modify phone number</li>
        </ul>
      </section>

      <hr />

      <section>
        <h2>2. Account Settings</h2>
        <p>
          Manage your account credentials and security options.
        </p>

        <ul>
          <li>Change password</li>
          <li>Enable two-factor authentication</li>
          <li>Manage login sessions</li>
        </ul>
      </section>

      <hr />

      <section>
        <h2>3. Notification Settings</h2>
        <p>
          Control how you receive updates and notifications.
        </p>

        <ul>
          <li>Email notifications</li>
          <li>SMS alerts</li>
          <li>Push notifications</li>
        </ul>
      </section>

      <hr />

      <section>
        <h2>4. Privacy Settings</h2>
        <p>
          Adjust your privacy preferences and control how your
          information is shared.
        </p>

        <ul>
          <li>Profile visibility</li>
          <li>Data sharing preferences</li>
          <li>Download account data</li>
        </ul>
      </section>

      <hr />

      <section>
        <h2>5. System Preferences</h2>
        <p>
          Customize your experience by changing system preferences.
        </p>

        <ul>
          <li>Language selection</li>
          <li>Theme preference (Light/Dark)</li>
          <li>Time zone settings</li>
        </ul>
      </section>

      <hr />

      <footer>
        <h3>Need Help?</h3>
        <p>
          If you are facing any issues, please contact support
          or visit the help center for assistance.
        </p>
      </footer>
    </div>
  );
}