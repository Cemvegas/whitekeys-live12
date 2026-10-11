{
  "patcher": {
    "fileversion": 1,
    "appversion": {
      "major": 8,
      "minor": 1,
      "revision": 2,
      "architecture": "x64",
      "modernui": 1
    },
    "classnamespace": "box",
    "rect": [
      60,
      100,
      720,
      560
    ],
    "openrect": [
      0,
      0,
      360,
      169
    ],
    "bglocked": 0,
    "openinpresentation": 1,
    "default_fontsize": 12,
    "default_fontface": 0,
    "default_fontname": "Arial",
    "gridonopen": 1,
    "gridsize": [
      8.0,
      8.0
    ],
    "gridsnaponopen": 1,
    "objectsnaponopen": 1,
    "statusbarvisible": 2,
    "toolbarvisible": 1,
    "lefttoolbarpinned": 0,
    "toptoolbarpinned": 0,
    "righttoolbarpinned": 0,
    "bottomtoolbarpinned": 0,
    "toolbars_unpinned_last_save": 0,
    "tallnewobj": 0,
    "boxanimatetime": 500,
    "enablehscroll": 1,
    "enablevscroll": 1,
    "devicewidth": 360,
    "description": "",
    "digest": "",
    "tags": "",
    "style": "",
    "subpatcher_template": "",
    "title": "WhiteKeys Live 12",
    "boxes": [
      {
        "box": {
          "id": "in",
          "maxclass": "newobj",
          "patching_rect": [
            20,
            240,
            180,
            22
          ],
          "numinlets": 1,
          "numoutlets": 1,
          "text": "midiin"
        }
      },
      {
        "box": {
          "id": "midi",
          "maxclass": "newobj",
          "patching_rect": [
            20,
            300,
            180,
            22
          ],
          "numinlets": 1,
          "numoutlets": 2,
          "text": "js whitekeys-midi.js"
        }
      },
      {
        "box": {
          "id": "out",
          "maxclass": "newobj",
          "patching_rect": [
            20,
            370,
            180,
            22
          ],
          "numinlets": 1,
          "numoutlets": 0,
          "text": "midiout"
        }
      },
      {
        "box": {
          "id": "this",
          "maxclass": "newobj",
          "patching_rect": [
            280,
            240,
            180,
            22
          ],
          "numinlets": 1,
          "numoutlets": 3,
          "text": "live.thisdevice"
        }
      },
      {
        "box": {
          "id": "defer",
          "maxclass": "newobj",
          "patching_rect": [
            280,
            275,
            180,
            22
          ],
          "numinlets": 1,
          "numoutlets": 1,
          "text": "deferlow"
        }
      },
      {
        "box": {
          "id": "init",
          "maxclass": "message",
          "patching_rect": [
            280,
            310,
            40,
            22
          ],
          "numinlets": 1,
          "numoutlets": 1,
          "text": "init"
        }
      },
      {
        "box": {
          "id": "api",
          "maxclass": "newobj",
          "patching_rect": [
            280,
            350,
            180,
            22
          ],
          "numinlets": 1,
          "numoutlets": 2,
          "text": "js whitekeys-api.js"
        }
      },
      {
        "box": {
          "id": "model",
          "maxclass": "newobj",
          "patching_rect": [
            280,
            410,
            180,
            22
          ],
          "numinlets": 1,
          "numoutlets": 3,
          "varname": "model",
          "text": "js whitekeys-state.js"
        }
      },
      {
        "box": {
          "id": "store",
          "maxclass": "newobj",
          "patching_rect": [
            20,
            470,
            180,
            22
          ],
          "numinlets": 1,
          "numoutlets": 3,
          "saved_attribute_attributes": {
            "valueof": {
              "parameter_longname": "Scale state",
              "parameter_shortname": "Scale state",
              "parameter_type": 3,
              "parameter_invisible": 1
            }
          },
          "text": "pattr scale_state @bindto model @parameter_enable 1",
          "saved_object_attributes": {
            "parameter_enable": 1
          }
        }
      },
      {
        "box": {
          "id": "title",
          "maxclass": "comment",
          "patching_rect": [
            20,
            20,
            210,
            20
          ],
          "numinlets": 1,
          "numoutlets": 0,
          "fontsize": 10,
          "fontface": 1,
          "varname": "scale_title",
          "textcolor": [
            0.8470588235294118,
            0.8705882352941177,
            0.8509803921568627,
            1
          ],
          "text": "WhiteKeys",
          "presentation": 1,
          "presentation_rect": [
            14,
            4,
            88,
            18
          ]
        }
      },
      {
        "box": {
          "id": "source",
          "maxclass": "umenu",
          "patching_rect": [
            245,
            20,
            100,
            20
          ],
          "numinlets": 1,
          "numoutlets": 3,
          "varname": "source_menu",
          "parameter_enable": 0,
          "bgcolor": [
            0.25882352941176473,
            0.29411764705882354,
            0.27058823529411763,
            1
          ],
          "textcolor": [
            0.8627450980392157,
            0.8901960784313725,
            0.8666666666666667,
            1
          ],
          "presentation": 1,
          "presentation_rect": [
            104,
            4,
            144,
            19
          ],
          "fontsize": 10,
          "bordercolor": [
            0.396078431372549,
            0.44313725490196076,
            0.40784313725490196,
            1
          ],
          "items": [
            "Local",
            ",",
            "Follow Live",
            ",",
            "Follow WhiteKeys"
          ]
        }
      },
      {
        "box": {
          "id": "keyboard",
          "maxclass": "jsui",
          "patching_rect": [
            20,
            55,
            332,
            62
          ],
          "numinlets": 1,
          "numoutlets": 1,
          "filename": "whitekeys-keyboard.js",
          "border": 0,
          "presentation": 1,
          "presentation_rect": [
            14,
            28,
            332,
            62
          ],
          "textcolor": [
            0.8470588235294118,
            0.8705882352941177,
            0.8509803921568627,
            1
          ],
          "fontsize": 10
        }
      },
      {
        "box": {
          "id": "rootlabel",
          "maxclass": "comment",
          "patching_rect": [
            14,
            120,
            53,
            18
          ],
          "numinlets": 1,
          "numoutlets": 0,
          "fontsize": 10,
          "textcolor": [
            0.8470588235294118,
            0.8705882352941177,
            0.8509803921568627,
            1
          ],
          "text": "Root",
          "presentation": 1,
          "presentation_rect": [
            14,
            94,
            53,
            12
          ]
        }
      },
      {
        "box": {
          "id": "root",
          "maxclass": "umenu",
          "patching_rect": [
            14,
            145,
            53,
            20
          ],
          "numinlets": 1,
          "numoutlets": 3,
          "varname": "root_menu",
          "parameter_enable": 0,
          "items": [
            "C",
            ",",
            "C#",
            ",",
            "D",
            ",",
            "Eb",
            ",",
            "E",
            ",",
            "F",
            ",",
            "F#",
            ",",
            "G",
            ",",
            "Ab",
            ",",
            "A",
            ",",
            "Bb",
            ",",
            "B"
          ],
          "fontsize": 10,
          "bgcolor": [
            0.25882352941176473,
            0.29411764705882354,
            0.27058823529411763,
            1
          ],
          "textcolor": [
            0.8627450980392157,
            0.8901960784313725,
            0.8666666666666667,
            1
          ],
          "presentation": 1,
          "presentation_rect": [
            14,
            106,
            53,
            18
          ],
          "bordercolor": [
            0.396078431372549,
            0.44313725490196076,
            0.40784313725490196,
            1
          ]
        }
      },
      {
        "box": {
          "id": "rootprep",
          "maxclass": "newobj",
          "patching_rect": [
            14,
            190,
            180,
            22
          ],
          "numinlets": 1,
          "numoutlets": 1,
          "text": "prepend rootselect"
        }
      },
      {
        "box": {
          "id": "scalelabel",
          "maxclass": "comment",
          "patching_rect": [
            75,
            120,
            129,
            18
          ],
          "numinlets": 1,
          "numoutlets": 0,
          "fontsize": 10,
          "textcolor": [
            0.8470588235294118,
            0.8705882352941177,
            0.8509803921568627,
            1
          ],
          "text": "Scale",
          "presentation": 1,
          "presentation_rect": [
            75,
            94,
            129,
            12
          ]
        }
      },
      {
        "box": {
          "id": "scale",
          "maxclass": "umenu",
          "patching_rect": [
            75,
            145,
            129,
            20
          ],
          "numinlets": 1,
          "numoutlets": 3,
          "varname": "scale_menu",
          "parameter_enable": 0,
          "items": [
            "Major",
            ",",
            "Minor",
            ",",
            "Dorian",
            ",",
            "Mixolydian",
            ",",
            "Lydian",
            ",",
            "Phrygian",
            ",",
            "Locrian",
            ",",
            "Harmonic Minor",
            ",",
            "Melodic Minor",
            ",",
            "Major Pentatonic",
            ",",
            "Minor Pentatonic",
            ",",
            "Whole Tone",
            ",",
            "Custom"
          ],
          "fontsize": 10,
          "bgcolor": [
            0.25882352941176473,
            0.29411764705882354,
            0.27058823529411763,
            1
          ],
          "textcolor": [
            0.8627450980392157,
            0.8901960784313725,
            0.8666666666666667,
            1
          ],
          "presentation": 1,
          "presentation_rect": [
            75,
            106,
            129,
            18
          ],
          "bordercolor": [
            0.396078431372549,
            0.44313725490196076,
            0.40784313725490196,
            1
          ]
        }
      },
      {
        "box": {
          "id": "scaleprep",
          "maxclass": "newobj",
          "patching_rect": [
            75,
            190,
            180,
            22
          ],
          "numinlets": 1,
          "numoutlets": 1,
          "text": "prepend scaleselect"
        }
      },
      {
        "box": {
          "id": "blacklabel",
          "maxclass": "comment",
          "patching_rect": [
            212,
            120,
            83,
            18
          ],
          "numinlets": 1,
          "numoutlets": 0,
          "fontsize": 10,
          "textcolor": [
            0.8470588235294118,
            0.8705882352941177,
            0.8509803921568627,
            1
          ],
          "text": "Black Keys",
          "presentation": 1,
          "presentation_rect": [
            212,
            94,
            134,
            12
          ]
        }
      },
      {
        "box": {
          "id": "black",
          "maxclass": "umenu",
          "patching_rect": [
            212,
            145,
            83,
            20
          ],
          "numinlets": 1,
          "numoutlets": 3,
          "varname": "black_menu",
          "parameter_enable": 0,
          "items": [
            "passthrough",
            ",",
            "ignore"
          ],
          "fontsize": 10,
          "bgcolor": [
            0.25882352941176473,
            0.29411764705882354,
            0.27058823529411763,
            1
          ],
          "textcolor": [
            0.8627450980392157,
            0.8901960784313725,
            0.8666666666666667,
            1
          ],
          "presentation": 1,
          "presentation_rect": [
            212,
            106,
            134,
            18
          ],
          "bordercolor": [
            0.396078431372549,
            0.44313725490196076,
            0.40784313725490196,
            1
          ]
        }
      },
      {
        "box": {
          "id": "blackprep",
          "maxclass": "newobj",
          "patching_rect": [
            212,
            190,
            180,
            22
          ],
          "numinlets": 1,
          "numoutlets": 1,
          "text": "prepend blackselect"
        }
      },
      {
        "box": {
          "id": "panic",
          "maxclass": "textbutton",
          "patching_rect": [
            302,
            145,
            44,
            20
          ],
          "numinlets": 1,
          "numoutlets": 3,
          "mode": 0,
          "fontsize": 10,
          "bgcolor": [
            0.25882352941176473,
            0.29411764705882354,
            0.27058823529411763,
            1
          ],
          "textcolor": [
            0.8627450980392157,
            0.8901960784313725,
            0.8666666666666667,
            1
          ],
          "text": "Panic",
          "presentation": 1,
          "presentation_rect": [
            302,
            4,
            44,
            19
          ],
          "bordercolor": [
            0.396078431372549,
            0.44313725490196076,
            0.40784313725490196,
            1
          ]
        }
      },
      {
        "box": {
          "id": "panicmsg",
          "maxclass": "message",
          "patching_rect": [
            210,
            205,
            55,
            22
          ],
          "numinlets": 1,
          "numoutlets": 1,
          "text": "panic"
        }
      },
      {
        "box": {
          "id": "status",
          "maxclass": "comment",
          "patching_rect": [
            20,
            520,
            332,
            18
          ],
          "numinlets": 1,
          "numoutlets": 0,
          "fontsize": 10,
          "varname": "status_label",
          "textcolor": [
            0.8470588235294118,
            0.8705882352941177,
            0.8509803921568627,
            1
          ],
          "text": "Live unavailable",
          "presentation": 1,
          "presentation_rect": [
            14,
            148,
            332,
            16
          ]
        }
      },
      {
        "box": {
          "id": "sourceprep",
          "maxclass": "newobj",
          "patching_rect": [
            245,
            190,
            180,
            22
          ],
          "numinlets": 1,
          "numoutlets": 1,
          "text": "prepend sourceselect"
        }
      },
      {
        "box": {
          "id": "host",
          "maxclass": "live.text",
          "patching_rect": [
            302,
            145,
            44,
            20
          ],
          "numinlets": 1,
          "numoutlets": 2,
          "mode": 1,
          "fontsize": 10,
          "bgcolor": [
            0.25882352941176473,
            0.29411764705882354,
            0.27058823529411763,
            1
          ],
          "textcolor": [
            0.8627450980392157,
            0.8901960784313725,
            0.8666666666666667,
            1
          ],
          "text": "Host Off",
          "presentation": 1,
          "presentation_rect": [
            254,
            4,
            42,
            19
          ],
          "bordercolor": [
            0.396078431372549,
            0.44313725490196076,
            0.40784313725490196,
            1
          ],
          "varname": "host_toggle",
          "parameter_enable": 0,
          "texton": "Host On",
          "bgoncolor": [
            0.7176470588235294,
            0.8235294117647058,
            0.6549019607843137,
            1
          ],
          "textoncolor": [
            0.12549019607843137,
            0.18823529411764706,
            0.12941176470588237,
            1
          ],
          "active": 1,
          "hint": "Host On shares this scale; Host Off stops sharing. Unavailable while following WhiteKeys.",
          "activebgcolor": [
            0.25882352941176473,
            0.29411764705882354,
            0.27058823529411763,
            1
          ],
          "activebgoncolor": [
            0.7176470588235294,
            0.8235294117647058,
            0.6549019607843137,
            1
          ],
          "activetextcolor": [
            0.8627450980392157,
            0.8901960784313725,
            0.8666666666666667,
            1
          ],
          "activetextoncolor": [
            0.12549019607843137,
            0.18823529411764706,
            0.12941176470588237,
            1
          ]
        }
      },
      {
        "box": {
          "id": "hostprep",
          "maxclass": "newobj",
          "text": "prepend hostselect",
          "patching_rect": [
            350,
            240,
            110,
            20
          ],
          "numinlets": 1,
          "numoutlets": 1
        }
      },
      {
        "box": {
          "id": "sourceinfo",
          "maxclass": "comment",
          "patching_rect": [
            20,
            520,
            332,
            18
          ],
          "numinlets": 1,
          "numoutlets": 0,
          "fontsize": 10,
          "varname": "source_status",
          "textcolor": [
            0.8470588235294118,
            0.8705882352941177,
            0.8509803921568627,
            1
          ],
          "text": "Live unavailable",
          "presentation": 1,
          "presentation_rect": [
            14,
            128,
            332,
            16
          ]
        }
      },
      {
        "box": {
          "id": "sharing",
          "maxclass": "newobj",
          "text": "js whitekeys-sharing.js",
          "patching_rect": [
            400,
            400,
            170,
            22
          ],
          "numinlets": 1,
          "numoutlets": 1
        }
      },
      {
        "box": {
          "id": "anchor",
          "varname": "song_anchor",
          "maxclass": "newobj",
          "text": "live.object",
          "patching_rect": [
            400,
            430,
            170,
            22
          ],
          "numinlets": 2,
          "numoutlets": 1,
          "saved_object_attributes": {
            "_persistence": 1
          }
        }
      },
      {
        "box": {
          "id": "anchorprep",
          "maxclass": "newobj",
          "text": "prepend nativeanchor",
          "patching_rect": [
            400,
            460,
            140,
            22
          ],
          "numinlets": 1,
          "numoutlets": 1
        }
      },
      {
        "box": {
          "id": "enrollment",
          "maxclass": "live.numbox",
          "patching_rect": [
            400,
            490,
            80,
            20
          ],
          "parameter_enable": 1,
          "saved_attribute_attributes": {
            "valueof": {
              "parameter_longname": "WhiteKeys sharing enrollment",
              "parameter_shortname": "WK enrollment",
              "parameter_type": 1,
              "parameter_invisible": 1,
              "parameter_mmin": 0,
              "parameter_mmax": 1,
              "parameter_initial_enable": 1,
              "parameter_initial": [
                1
              ]
            }
          }
        }
      },
      {
        "box": {
          "id": "conflict",
          "maxclass": "umenu",
          "patching_rect": [
            400,
            520,
            250,
            20
          ],
          "numinlets": 1,
          "numoutlets": 3,
          "varname": "conflict_menu",
          "parameter_enable": 0,
          "bgcolor": [
            0.25882352941176473,
            0.29411764705882354,
            0.27058823529411763,
            1
          ],
          "textcolor": [
            0.8627450980392157,
            0.8901960784313725,
            0.8666666666666667,
            1
          ],
          "presentation": 1,
          "presentation_rect": [
            14,
            128,
            332,
            19
          ],
          "fontsize": 10,
          "bordercolor": [
            0.396078431372549,
            0.44313725490196076,
            0.40784313725490196,
            1
          ],
          "items": [
            "Identity conflict: keep identity on..."
          ],
          "hidden": 1
        }
      },
      {
        "box": {
          "id": "conflictprep",
          "maxclass": "newobj",
          "text": "prepend conflictselect",
          "patching_rect": [
            400,
            550,
            150,
            22
          ],
          "numinlets": 1,
          "numoutlets": 1
        }
      }
    ],
    "lines": [
      {
        "patchline": {
          "source": [
            "root",
            0
          ],
          "destination": [
            "rootprep",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "rootprep",
            0
          ],
          "destination": [
            "model",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "scale",
            0
          ],
          "destination": [
            "scaleprep",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "scaleprep",
            0
          ],
          "destination": [
            "model",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "black",
            0
          ],
          "destination": [
            "blackprep",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "blackprep",
            0
          ],
          "destination": [
            "model",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "in",
            0
          ],
          "destination": [
            "midi",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "midi",
            0
          ],
          "destination": [
            "out",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "this",
            0
          ],
          "destination": [
            "defer",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "defer",
            0
          ],
          "destination": [
            "init",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "init",
            0
          ],
          "destination": [
            "api",
            0
          ],
          "order": 1
        }
      },
      {
        "patchline": {
          "source": [
            "init",
            0
          ],
          "destination": [
            "model",
            0
          ],
          "order": 0
        }
      },
      {
        "patchline": {
          "source": [
            "api",
            0
          ],
          "destination": [
            "model",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "model",
            0
          ],
          "destination": [
            "midi",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "keyboard",
            0
          ],
          "destination": [
            "model",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "source",
            0
          ],
          "destination": [
            "sourceprep",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "sourceprep",
            0
          ],
          "destination": [
            "model",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "panic",
            0
          ],
          "destination": [
            "panicmsg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "panicmsg",
            0
          ],
          "destination": [
            "midi",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "midi",
            1
          ],
          "destination": [
            "keyboard",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "model",
            1
          ],
          "destination": [
            "keyboard",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "host",
            0
          ],
          "destination": [
            "hostprep",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "hostprep",
            0
          ],
          "destination": [
            "model",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "init",
            0
          ],
          "destination": [
            "sharing",
            0
          ],
          "order": 2
        }
      },
      {
        "patchline": {
          "source": [
            "model",
            2
          ],
          "destination": [
            "sharing",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "anchor",
            0
          ],
          "destination": [
            "anchorprep",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "anchorprep",
            0
          ],
          "destination": [
            "sharing",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "conflict",
            0
          ],
          "destination": [
            "conflictprep",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "conflictprep",
            0
          ],
          "destination": [
            "model",
            0
          ]
        }
      }
    ],
    "dependency_cache": [
      {
        "name": "whitekeys-midi.js",
        "bootpath": ".",
        "patcherrelativepath": ".",
        "type": "TEXT",
        "implicit": 1
      },
      {
        "name": "whitekeys-api.js",
        "bootpath": ".",
        "patcherrelativepath": ".",
        "type": "TEXT",
        "implicit": 1
      },
      {
        "name": "whitekeys-state.js",
        "bootpath": ".",
        "patcherrelativepath": ".",
        "type": "TEXT",
        "implicit": 1
      },
      {
        "name": "whitekeys-keyboard.js",
        "bootpath": ".",
        "patcherrelativepath": ".",
        "type": "TEXT",
        "implicit": 1
      },
      {
        "name": "whitekeys-sharing.js",
        "bootpath": ".",
        "patcherrelativepath": ".",
        "type": "TEXT",
        "implicit": 1
      }
    ],
    "latency": 0,
    "project": {
      "version": 1,
      "creationdate": 3590052786,
      "modificationdate": 3590052786,
      "viewrect": [
        0.0,
        0.0,
        300.0,
        500.0
      ],
      "autoorganize": 1,
      "hideprojectwindow": 1,
      "showdependencies": 1,
      "autolocalize": 0,
      "contents": {
        "patchers": {},
        "code": {
          "whitekeys-midi.js": {
            "kind": "javascript",
            "local": 1
          },
          "whitekeys-api.js": {
            "kind": "javascript",
            "local": 1
          },
          "whitekeys-state.js": {
            "kind": "javascript",
            "local": 1
          },
          "whitekeys-keyboard.js": {
            "kind": "javascript",
            "local": 1
          }
        }
      },
      "layout": {},
      "searchpath": {},
      "detailsvisible": 0,
      "amxdtype": 1835887981,
      "readonly": 0,
      "devpathtype": 0,
      "devpath": ".",
      "sortmode": 0,
      "viewmode": 0
    },
    "autosave": 0,
    "bgcolor": [
      0.1607843137254902,
      0.1803921568627451,
      0.17254901960784313,
      1
    ],
    "parameters": {
      "store": [
        "Scale state",
        "Scale state",
        0
      ],
      "parameterbanks": {
        "0": {
          "index": 0,
          "name": "",
          "parameters": [
            "-",
            "-",
            "-",
            "-",
            "-",
            "-",
            "-",
            "-"
          ]
        }
      },
      "inherited_shortname": 1,
      "enrollment": [
        "WhiteKeys sharing enrollment",
        "WK enrollment",
        0
      ]
    }
  }
}
