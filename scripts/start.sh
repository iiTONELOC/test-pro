#!/bin/zsh
# Force the env to be production

cd ./packages/server

ENV_FILE=".env"
TARGET_VARIABLE="NODE_ENV"

# Check if the variable is present and commented out
if grep -q "^ *# *$TARGET_VARIABLE=" "$ENV_FILE"; then
  # Uncomment the variable
  echo "Uncommenting $TARGET_VARIABLE."
  sed -i '' "s/^ *# *$TARGET_VARIABLE=/$TARGET_VARIABLE=/" "$ENV_FILE"
fi

# Check if the variable is present
if grep -q "^$TARGET_VARIABLE=" "$ENV_FILE"; then
  # Set it to production if not already set
  if ! grep -q "^$TARGET_VARIABLE=production" "$ENV_FILE"; then
    echo "Setting $TARGET_VARIABLE to production."
    sed -i '' "s/^$TARGET_VARIABLE=.*/$TARGET_VARIABLE=production/" "$ENV_FILE"
  fi
else
  # If it's not present, add and set it to production
  echo "Adding and setting $TARGET_VARIABLE to production."
  echo "$TARGET_VARIABLE=production" >> "$ENV_FILE"
fi

# Start the server in the background
npm start &

# Wait for the server to start (you may adjust the sleep duration)
sleep 2

# Open the browser in a new window to localhost:3000 in the background if not already open
if ! pgrep -f "Brave Browser.*localhost:3000" > /dev/null; then
  # If not open, open a new window
  open -na "Brave Browser" --args --new-window http://localhost:3000 &
fi

# Wait for the server to close and make sure the port connection on 3000 is closed
wait
lsof -ti tcp:3000 | xargs kill
