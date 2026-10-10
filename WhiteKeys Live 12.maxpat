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
      560,
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
    "devicewidth": 560,
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
          "numoutlets": 1,
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
          "id": "blackprep",
          "maxclass": "newobj",
          "patching_rect": [
            20,
            180,
            180,
            22
          ],
          "numinlets": 1,
          "numoutlets": 1,
          "text": "prepend blackkeys"
        }
      },
      {
        "box": {
          "id": "black",
          "maxclass": "live.menu",
          "patching_rect": [
            20,
            120,
            170,
            22
          ],
          "numinlets": 1,
          "numoutlets": 3,
          "varname": "black_keys",
          "parameter_enable": 1,
          "items": [
            "passthrough",
            ",",
            "ignore"
          ],
          "saved_attribute_attributes": {
            "valueof": {
              "parameter_longname": "Black Keys",
              "parameter_shortname": "Black Keys",
              "parameter_type": 2,
              "parameter_enum": [
                "passthrough",
                "ignore"
              ],
              "parameter_initial_enable": 1,
              "parameter_initial": [
                0
              ]
            }
          },
          "presentation": 1,
          "presentation_rect": [
            16,
            95,
            170,
            22
          ]
        }
      },
      {
        "box": {
          "id": "title",
          "maxclass": "comment",
          "patching_rect": [
            20,
            20,
            450,
            24
          ],
          "numinlets": 1,
          "numoutlets": 0,
          "fontsize": 17,
          "fontface": 1,
          "text": "WHITE KEYS  /  LIVE 12",
          "presentation": 1,
          "presentation_rect": [
            16,
            8,
            530,
            24
          ]
        }
      },
      {
        "box": {
          "id": "status",
          "maxclass": "comment",
          "patching_rect": [
            280,
            400,
            420,
            44
          ],
          "numinlets": 1,
          "numoutlets": 0,
          "varname": "api_status",
          "text": "Live API bekleniyor...",
          "presentation": 1,
          "presentation_rect": [
            16,
            36,
            530,
            44
          ]
        }
      },
      {
        "box": {
          "id": "blacklabel",
          "maxclass": "comment",
          "patching_rect": [
            20,
            90,
            150,
            20
          ],
          "numinlets": 1,
          "numoutlets": 0,
          "text": "Siyah tuslar",
          "presentation": 1,
          "presentation_rect": [
            16,
            76,
            170,
            18
          ]
        }
      },
      {
        "box": {
          "id": "panic",
          "maxclass": "textbutton",
          "patching_rect": [
            210,
            120,
            85,
            24
          ],
          "numinlets": 1,
          "numoutlets": 3,
          "mode": 0,
          "text": "PANIC",
          "presentation": 1,
          "presentation_rect": [
            206,
            95,
            85,
            24
          ]
        }
      },
      {
        "box": {
          "id": "panicmsg",
          "maxclass": "message",
          "patching_rect": [
            210,
            180,
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
          "id": "refresh",
          "maxclass": "textbutton",
          "patching_rect": [
            315,
            120,
            85,
            24
          ],
          "numinlets": 1,
          "numoutlets": 3,
          "mode": 0,
          "text": "YENILE",
          "presentation": 1,
          "presentation_rect": [
            315,
            95,
            85,
            24
          ]
        }
      },
      {
        "box": {
          "id": "refreshmsg",
          "maxclass": "message",
          "patching_rect": [
            400,
            180,
            60,
            22
          ],
          "numinlets": 1,
          "numoutlets": 1,
          "text": "refresh"
        }
      },
      {
        "box": {
          "id": "foot",
          "maxclass": "comment",
          "patching_rect": [
            20,
            450,
            530,
            22
          ],
          "numinlets": 1,
          "numoutlets": 0,
          "text": "C D E F G A B -> 1 2 3 4 5 6 7  |  7 notali gamlar",
          "presentation": 1,
          "presentation_rect": [
            16,
            134,
            530,
            22
          ]
        }
      }
    ],
    "lines": [
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
            "api",
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
            "midi",
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
            "refresh",
            0
          ],
          "destination": [
            "refreshmsg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "refreshmsg",
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
            "api",
            1
          ],
          "destination": [
            "status",
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
    "parameters": {
      "black": [
        "Black Keys",
        "Black Keys",
        0
      ],
      "parameterbanks": {
        "0": {
          "index": 0,
          "name": "",
          "parameters": [
            "black",
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
