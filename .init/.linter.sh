#!/bin/bash
cd /home/kavia/workspace/code-generation/e-commerce-platform-8104/ecommerce_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

