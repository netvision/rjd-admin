<script setup>

import {  ref, onMounted } from 'vue';
import axios from 'axios'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { useTheme } from '/@/composables';
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const { toggleDark } = useTheme();

const show = ref(false);

const day = ref(new Date())
const logs = ref([])
const mapDiv = ref()
const markers = ref()
const bounds = ref([])
const setMapbox = () => {
     mapDiv.value = L.map("mapContainer").setView([28.241600, 75.649902], 13);
     markers.value = L.layerGroup(L.marker([28.241600, 75.649902]).bindPopup('Hello')).addTo(mapDiv.value)
     L.tileLayer(
       "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
       {
         attribution:
           'Map data (c) <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
         maxZoom: 18,
         id: "mapbox/streets-v11",
         accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
       }
     ).addTo(mapDiv.value);
     markers.value.addTo(mapDiv.value);
   }
  const getData = async() => {
    markers.value.remove()
    mapDiv.value.panTo([28.241600, 75.649902])
    markers.value = L.layerGroup()
    let d = day.value.toISOString().slice(0, 10)
    
    let res = await axios
      .get('http://rkjdss.dalmiatrusts.in/rjdssapi/web/staff-logs/daily?d=' + d, {
        headers: { Accept: 'application/json, text/plain' },
      })
      .then((r) => r.data)
      console.log(res)
    res.forEach((r) => {
      let content = '<h3 class="text-lg border-b-2 border-b-gray-900">'+formatName(r.user)+'</h3>'
      content += '<p class="text-base text-black">Activity: '+r.activity_type+'</p>'
      content += '<p class="text-base text-black">At: '+r.date_time+'</p>'
      content += '<p class="text-base text-black">Contact: '+r.contacted_person+'</p>'
      content += '<p class="text-base text-black">Discussion: '+r.discussion+'<br />'+r.other_info+'</p>'
      bounds.value.push([r.latitude, r.longitude])
      let marker = L.marker([r.latitude, r.longitude]).bindPopup(content)
      markers.value.addLayer(marker).addTo(mapDiv.value)
    })
    mapDiv.value.fitBounds(bounds.value)
  }
const formatName = (name) => {
  let n = name.split('.')
  if(n.length > 1) {
    return n[0].charAt(0).toUpperCase() + n[0].slice(1) + ' ' + n[1].charAt(0).toUpperCase() + n[1].slice(1)
  }
  else return name.charAt(0).toUpperCase() + name.slice(1)
}
onMounted(() => {
  setMapbox()
})

</script>
<template>
  
  <div class="container mt-10">
    <div id="mapContainer" ref="map" class="h-lg w-full mx-5"></div>
    <VueDatePicker v-model="day" format="dd-MM-yyyy" auto-apply @closed="getData()"></VueDatePicker>
    <footer class="footer sticky text-center">
      <ul class="flex justify-center w-1/3 mx-auto mb-8">
        <li class="cursor-pointer text-2xl">
          <a
            href="#"
            @click="toggleDark()"
            class="text-cyan-700 hover:text-cyan-500"
            title="Toggle Theme"
          >
            <i i="ph-sun dark:ph-moon" />
          </a>
        </li>
      </ul>

      <span class="text-xs"
        >Developed by: 
        <a
          class="footer-link text-cyan-400 hover:text-cyan-500"
          href="https://github.com/netvision"
          rel="noreferrer"
          target="_blank"
          >Rakesh Jangid</a
        ></span
      >
    </footer>
  </div>
</template>

<style>
a,
.footer-link {
  @apply transition-all ease-out duration-100;
}

.footer-link {
  opacity: 0.8;
}
</style>
