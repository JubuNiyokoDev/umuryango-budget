# CMake minimum version
cmake_minimum_required(VERSION 3.13)

# Nom du module natif
project(umuryangobudget)

# Activer C++17, RTTI et exceptions (nécessaire pour Reanimated 3.x et Hermes)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -frtti -fexceptions")

# Inclure React Native headers (auto-lien fait le reste)
include_directories(${CMAKE_SOURCE_DIR}/../node_modules/react-native/React)
include_directories(${CMAKE_SOURCE_DIR}/../node_modules/react-native/ReactCommon)
