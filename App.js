import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, SafeAreaView, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import React, { useCallback, useState } from "react";
import * as Icons from "react-native-heroicons/solid";
import { theme } from './theme';
import { debounce } from 'lodash';
import { getLocations, getWeather } from "./api/apicall";
import { weatherImages } from "./assets/weather_images";


export default function App() {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState([]);

  const handleLocationSelect = (loc) => {
    console.log("location selected: ", loc);
    setLocations([]);
    toggleSearch(false);
    getWeather({cityName: loc.name, days: '8'}).then(data => {
      setWeather(data);
    });
  }

  const handleSearch = (text) => {
    if(text.length > 2){
      getLocations({cityName: text}).then(data => {
        setLocations(data);
      });
    }
  }

  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);
  const {current, location} = weather;

  return (
    <View className="flex-1 items-center justify-center bg-gray-200">
      <Image source={require('./assets/background.png')} blurRadius={30} className='absolute h-full w-full'/>
      <Text className="text-3xl font-bold pt-10 pb-5">The Weather</Text>
      <SafeAreaView className="flex flex-1 w-full">
        {/* srč sekcija */}
        <View style={{height: '7%'}} className="mx-4 relative z-50">
          <View style={{backgroundColor: showSearch? 'white': 'transparent', opacity: showSearch? 1: 0.3}}className="flex-row justify-end bg-white opacity-70 items-center rounded-full">
            {
              showSearch? (<TextInput onChangeText={handleTextDebounce} placeholder='Search a city...' className="pl-6 h-10 flex-1 text-base"></TextInput>): null
            }
            
            <TouchableOpacity onPress={() => toggleSearch(!showSearch)} className='bg-white rounded-full p-3 m-1'>
              <Icons.MagnifyingGlassIcon />
            </TouchableOpacity>
          </View>
          {
            locations.length > 0 && showSearch? (
              <View className="absolute w-full z-40 bg-gray-200 top-16 rounded-xl">
                {locations.map((loc, index) => {
                  let showBorder = index + 1 !== locations.length;
                  return (
                    <TouchableOpacity 
                      onPress={() => handleLocationSelect(loc)}
                      key={index} 
                      className={showBorder? "flex-row items-center p-4 border-b-2 border-b-gray-400": "flex-row items-center p-4" }
                    >
                      <Icons.MapPinIcon size={20} className="mr-4"/>
                      <Text className="text-lg">{loc.name}, {loc.region}, {loc.country}</Text>
                    </TouchableOpacity>
                  )
                  })}
              </View>
            ): null
          }
        </View>
        {/* trenutno stanje sekcija */}
        <View className="mx-4 flex justify-around flex-1 mb-2">
          <Text className="text-3xl text-center text-white font-bold">{location?.name},
            <Text className="text-lg text-center text-gray-300 font-semibold"> {location?.region},</Text>
            <Text className="text-lg text-center text-gray-300 font-semibold"> {location?.country}</Text>
          </Text>
          <View className="flex-row justify-center">
            <Image source={require('./assets/clock.png')} className="w-10 h-10"/>
            <Text className="text-lg text-center text-gray-300 font-semibold pl-4 pt-2">{location?.localtime.substr(10)}</Text>
          </View>
          <View className="flex-row justify-center">
            <Image source={weatherImages[current?.condition?.text]} className="w-36 h-36"/>
          </View>
          <View className="space-y-2">
            <Text className="text-3xl text-center text-white font-bold">{current?.temp_c}°</Text>
            <Text className="text-lg text-center text-gray-300 font-semibold tracking-wider">{current?.condition?.text}</Text>
          </View>
          <View className="flex-row justify-between mx-4">
            <View className="flex-row space-x-2 items-center">
              <Image source={require('./assets/wind.png')} className="w-10 h-10"/>
              <Text className="text-white">{current?.wind_kph} km/h</Text>
            </View>
            <View className="flex-row space-x-2 items-center">
              <Image source={require('./assets/humidity.png')} className="w-10 h-10"/>
              <Text className="text-white">{current?.humidity}%</Text>
            </View>
          </View>
          <View className="flex-row justify-between mx-4">
            <View className="flex-row space-x-2 items-center">
              <Image source={require('./assets/precipitation.png')} className="w-10 h-10"/>
              <Text className="text-white">{current?.precip_mm} mm</Text>
            </View>
            <View className="flex-row space-x-2 items-center">
              <Image source={require('./assets/uv-index.png')} className="w-10 h-10"/>
              <Text className="text-white">{current?.uv}</Text>
            </View>
          </View>
        </View>
        {/* prognoza sekcija */}
        <View className="mb-2 space-y-3">
          <View className="flex-row items-center mx-5 space-x-2">
            <Icons.ClockIcon size={20} color="white"/>
            <Text className="text-white text-base">Forecast</Text> 
          </View>
          <ScrollView horizontal contentContainerStyle={{paddingHorizontal: 10}}>
            {
              weather?.forecast?.forecastday?.slice(1).map((item, index) => {
              let date = new Date(item.date);
              let day = date.toLocaleDateString('en-us', { weekday: 'long' });
              return ( 
                <View key = {index} className="flex justify-center items-center w-24 h-30 rounded-3xl py-3 space-y-1 mr-4" style={{backgroundColor: theme.whiteBackground(0.3)}}>
                  <Image source={weatherImages[item?.day?.condition?.text]} className="w-10 h-10"/>
                  <Text className="text-black">{day.substring(0, day.indexOf(','))}</Text>
                  <Text className="text-black">Min: {item?.day?.mintemp_c}</Text>
                  <Text className="text-black">Max: {item?.day?.maxtemp_c}</Text>
                </View>
                )
              })
            }
            
          </ScrollView>
        </View>
      </SafeAreaView>
      <StatusBar style="auto" />
    </View>
  );
}

