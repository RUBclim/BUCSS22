# BUCSS22
Course materials from the Bochum Urban Climate Summer School (Germany, 2022)

## Context
The first three editions of BUCSS took place in Bucharest (Romania) (see e.g. [here](https://icub.unibuc.ro/events/bucss2019/) for 2019). 
This 4th edition took place from 26 to 29 September 2022 at Ruhr-University Bochum (Germany), and aimed at 1) providing a general introduction to different facets of urban climatology with a special focus on urban climate informatics, 2) providing structured information and skill-building capabilities related to urban climate monitoring, remote sensing and modelling, and 3) strengthening an active pool of young scientists to tackle the major urban sustainability challenges of future generations.

Official website: [https://www.climate.ruhr-uni-bochum.de/bucss/](https://www.climate.ruhr-uni-bochum.de/bucss/) 


## Course materials
The programme consists out of state-of-the-art lectures and hands-on tutorials on remote sensing in urban areas, crowdsourcing and urban climate modelling. All of these teaching resources are available here:  

### 1. Lectures

#### _Monday 26.09_
- **Student self-presentations**
- **Gerald Mills**: 
- **Andreas Christen**:
- **Benjamin Bechtel**:
- **Simone Kotthaus**: 
- **Matthias Demuzere**: [Introduction to Google Colaboratory](https://github.com/RUBclim/BUCSS22/blob/main/lectures/Demuzere_GoogleColab_Intro.pdf)

#### _Tuesday 27.09_
- **Ariane Middel**: [Urban Climate Informatics](https://github.com/RUBclim/BUCSS22/blob/main/lectures/Middel_UCI.pdf)
- **Negin Nazarian**: 
- **Daniel Fenner**: [Crowdsourcing Crowd (Citizen) Weather Station Data](https://github.com/RUBclim/BUCSS22/blob/main/lectures/Fenner_Crowdsourcing_CWS.pdf)
- **Matthias Demuzere**: [Introduction to Google Earth Engine](https://github.com/RUBclim/BUCSS22/blob/main/lectures/Demuzere_GoogleEarthEngine.pdf)

#### _Wednesday 28.09_
- **Leena Järvi**: [General introduction to urban climate modelling](https://github.com/RUBclim/BUCSS22/blob/main/lectures/Jarvi_modelling.pdf)
- **Robert Rauterkus**: [Urban Climate Modeling With PALM](https://github.com/RUBclim/BUCSS22/blob/main/lectures/Rauterkus_PALM.pdf)
- **Helen Claire Ward**: [Evaluating urban climate models](https://github.com/RUBclim/BUCSS22/blob/main/lectures/Ward_ModelEvaulation.pdf)

#### _Thursday 29.09_
- **Andrea Zonato**: [Introduction to WRF](https://github.com/RUBclim/BUCSS22/blob/main/lectures/Zonato_WRF.pdf)
- **Matthias Demuzere and Andrea Zonato**: [Guidelines for the WRF hands-on session](https://github.com/RUBclim/BUCSS22/blob/main/lectures/Demuzere_Zonato_WRF-HandsOn.pdf)


### 2. Hands-on sessions


#### _Process ESA CCI LST/SUHI data_



#### _Quality control CWS data with CrowdQC+_



#### _Greenest German city in Google Earth Engine_

![gee_greenest_cities.png](img/gee_greenest_cities.png)

In [this interactive newspaper article](https://interaktiv.morgenpost.de/gruenste-staedte-deutschlands/), published in the Berliner Morgenpost May 10 2016, the authors used the Landsat archive in Google Earth Engine to estimate the "greenest" large (>100 000 inhabitants) city in Germany.   

The goal of this hands-on is the replicate this work, using Sentinel-2 information in stead. The procedure consist out of three steps:

1. Create a database with relevant cities ([Python notebook](notebooks/GEE_prep_city_data.ipynb))
2. Add greennees to this database ([GEE javascript](notebooks/greenest_city_germany.js))
3. Display the results ([Python notebook](notebooks/GEE_plot_city_data.ipynb))

This hands-on requires the .csv and .json files available under `data/GEE/`


#### _WRF evaluation and roottop mitigation strategies_