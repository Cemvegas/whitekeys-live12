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
          "numoutlets": 2,
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
              "parameter_invisible": 2
            }
          },
          "text": "pattr scale_state @bindto model @parameter_enable 1"
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
          "fontsize": 13,
          "fontface": 1,
          "varname": "scale_title",
          "textcolor": [
            0.25,
            0.32,
            0.21,
            1
          ],
          "text": "C Major",
          "presentation": 1,
          "presentation_rect": [
            14,
            8,
            228,
            20
          ]
        }
      },
      {
        "box": {
          "id": "follow",
          "maxclass": "live.text",
          "patching_rect": [
            245,
            20,
            100,
            20
          ],
          "numinlets": 1,
          "numoutlets": 2,
          "varname": "follow_toggle",
          "texton": "Follow Live",
          "mode": 1,
          "parameter_enable": 0,
          "bgcolor": [
            0.87,
            0.9,
            0.8,
            1
          ],
          "bgoncolor": [
            0.68,
            0.77,
            0.49,
            1
          ],
          "textcolor": [
            0.25,
            0.32,
            0.21,
            1
          ],
          "textoncolor": [
            0.25,
            0.32,
            0.21,
            1
          ],
          "text": "Follow Live",
          "presentation": 1,
          "presentation_rect": [
            252,
            9,
            94,
            19
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
            33,
            332,
            62
          ]
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
          "fontsize": 9,
          "textcolor": [
            0.25,
            0.32,
            0.21,
            1
          ],
          "text": "Root",
          "presentation": 1,
          "presentation_rect": [
            14,
            102,
            53,
            16
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
            0.89,
            0.91,
            0.83,
            1
          ],
          "textcolor": [
            0.25,
            0.32,
            0.21,
            1
          ],
          "presentation": 1,
          "presentation_rect": [
            14,
            120,
            53,
            20
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
          "fontsize": 9,
          "textcolor": [
            0.25,
            0.32,
            0.21,
            1
          ],
          "text": "Scale",
          "presentation": 1,
          "presentation_rect": [
            75,
            102,
            129,
            16
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
            0.89,
            0.91,
            0.83,
            1
          ],
          "textcolor": [
            0.25,
            0.32,
            0.21,
            1
          ],
          "presentation": 1,
          "presentation_rect": [
            75,
            120,
            129,
            20
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
          "fontsize": 9,
          "textcolor": [
            0.25,
            0.32,
            0.21,
            1
          ],
          "text": "Black Keys",
          "presentation": 1,
          "presentation_rect": [
            212,
            102,
            83,
            16
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
            0.89,
            0.91,
            0.83,
            1
          ],
          "textcolor": [
            0.25,
            0.32,
            0.21,
            1
          ],
          "presentation": 1,
          "presentation_rect": [
            212,
            120,
            83,
            20
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
            0.88,
            0.89,
            0.82,
            1
          ],
          "textcolor": [
            0.25,
            0.32,
            0.21,
            1
          ],
          "text": "Panic",
          "presentation": 1,
          "presentation_rect": [
            302,
            120,
            44,
            20
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
          "fontsize": 9,
          "varname": "status_label",
          "textcolor": [
            0.25,
            0.32,
            0.21,
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
          "id": "followprep",
          "maxclass": "newobj",
          "patching_rect": [
            245,
            190,
            180,
            22
          ],
          "numinlets": 1,
          "numoutlets": 1,
          "text": "prepend followselect"
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
            "model",
            0
          ]
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
            "follow",
            0
          ],
          "destination": [
            "followprep",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "followprep",
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
      0.95,
      0.95,
      0.9,
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
      "inherited_shortname": 1
    }
  }
}
