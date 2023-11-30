#!/bin/zsh
# Force the env to be development

TARGET_VARIABLE="NODE_ENV"
ENV_FILE="./packages/server/.env"

# Check if the .env file exists
if [ -e "$ENV_FILE" ]; then
    # Set the variable to development or uncomment if necessary
    if grep -q "^ *# *$TARGET_VARIABLE=" "$ENV_FILE"; then
        # Uncomment the variable
         echo "Uncommenting $TARGET_VARIABLE."
        sed -i '' "/^ *# *$TARGET_VARIABLE=/s/^# *//" "$ENV_FILE"
    fi

    # Ensure it is set to development
    if ! grep -q "^$TARGET_VARIABLE=development" "$ENV_FILE"; then
        # If it exists with a different value, replace it; otherwise, add it
        if grep -q "^$TARGET_VARIABLE=" "$ENV_FILE"; then
            echo "Setting $TARGET_VARIABLE to development."
            sed -i '' "s/^$TARGET_VARIABLE=.*/$TARGET_VARIABLE=development/" "$ENV_FILE"
        else
            echo "Adding $TARGET_VARIABLE and setting to development."
            echo "$TARGET_VARIABLE=development" >> "$ENV_FILE"
        fi
    fi
else
    # If the file doesn't exist, create it and set to development
    echo "Creating $ENV_FILE and setting $TARGET_VARIABLE to development."
    echo "$TARGET_VARIABLE=development" > "$ENV_FILE"
fi
