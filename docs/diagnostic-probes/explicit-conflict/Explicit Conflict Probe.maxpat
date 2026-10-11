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
    "rect": [
      0,
      0,
      720,
      760
    ],
    "openinpresentation": 1,
    "devicewidth": 680,
    "boxes": [
      {
        "box": {
          "id": "ready",
          "maxclass": "newobj",
          "patching_rect": [
            10,
            250,
            95,
            22
          ],
          "text": "live.thisdevice"
        }
      },
      {
        "box": {
          "id": "defer",
          "maxclass": "newobj",
          "patching_rect": [
            115,
            250,
            65,
            22
          ],
          "text": "deferlow"
        }
      },
      {
        "box": {
          "id": "init",
          "maxclass": "message",
          "patching_rect": [
            190,
            250,
            40,
            22
          ],
          "text": "init"
        }
      },
      {
        "box": {
          "id": "model",
          "maxclass": "newobj",
          "patching_rect": [
            10,
            285,
            185,
            22
          ],
          "text": "js explicit-conflict.js",
          "varname": "model",
          "numoutlets": 2,
          "outlettype": [
            "",
            ""
          ]
        }
      },
      {
        "box": {
          "id": "store",
          "maxclass": "newobj",
          "patching_rect": [
            10,
            320,
            360,
            22
          ],
          "text": "pattr conflict_probe_state @bindto model @parameter_enable 1",
          "saved_attribute_attributes": {
            "valueof": {
              "parameter_longname": "Conflict Probe State",
              "parameter_shortname": "Conflict State",
              "parameter_type": 3,
              "parameter_invisible": 1
            }
          },
          "saved_object_attributes": {
            "parameter_enable": 1
          }
        }
      },
      {
        "box": {
          "id": "status",
          "maxclass": "comment",
          "patching_rect": [
            10,
            370,
            680,
            115
          ],
          "text": "Waiting for Live",
          "linecount": 6,
          "presentation": 1,
          "presentation_rect": [
            365,
            8,
            305,
            155
          ],
          "fontsize": 9
        }
      },
      {
        "box": {
          "id": "mi",
          "maxclass": "newobj",
          "patching_rect": [
            450,
            285,
            50,
            22
          ],
          "text": "midiin"
        }
      },
      {
        "box": {
          "id": "mo",
          "maxclass": "newobj",
          "patching_rect": [
            450,
            320,
            50,
            22
          ],
          "text": "midiout"
        }
      },
      {
        "box": {
          "id": "title",
          "maxclass": "comment",
          "patching_rect": [
            14,
            5,
            245,
            20
          ],
          "presentation": 1,
          "presentation_rect": [
            14,
            5,
            245,
            20
          ],
          "text": "WHITEKEYS #19 \u00b7 CONFLICT PROBE",
          "textcolor": [
            0.85,
            0.9,
            0.85,
            1
          ]
        }
      },
      {
        "box": {
          "id": "hl",
          "maxclass": "comment",
          "patching_rect": [
            282,
            5,
            45,
            20
          ],
          "presentation": 1,
          "presentation_rect": [
            282,
            5,
            45,
            20
          ],
          "text": "Host",
          "textcolor": [
            0.85,
            0.9,
            0.85,
            1
          ]
        }
      },
      {
        "box": {
          "id": "host_toggle",
          "maxclass": "toggle",
          "patching_rect": [
            327,
            5,
            20,
            20
          ],
          "presentation": 1,
          "presentation_rect": [
            327,
            5,
            20,
            20
          ],
          "varname": "host_toggle",
          "checkedcolor": [
            0.71,
            0.82,
            0.65,
            1
          ]
        }
      },
      {
        "box": {
          "id": "hostcmd",
          "maxclass": "newobj",
          "patching_rect": [
            400,
            250,
            100,
            22
          ],
          "text": "prepend host"
        }
      },
      {
        "box": {
          "id": "sl",
          "maxclass": "comment",
          "patching_rect": [
            14,
            30,
            95,
            18
          ],
          "presentation": 1,
          "presentation_rect": [
            14,
            30,
            95,
            18
          ],
          "text": "Scale Source",
          "textcolor": [
            0.65,
            0.72,
            0.67,
            1
          ]
        }
      },
      {
        "box": {
          "id": "source_menu",
          "maxclass": "umenu",
          "patching_rect": [
            14,
            49,
            332,
            22
          ],
          "presentation": 1,
          "presentation_rect": [
            14,
            49,
            332,
            22
          ],
          "items": [
            "Local"
          ],
          "varname": "source_menu",
          "bgcolor": [
            0.26,
            0.3,
            0.27,
            1
          ],
          "textcolor": [
            0.86,
            0.9,
            0.86,
            1
          ]
        }
      },
      {
        "box": {
          "id": "source_menucmd",
          "maxclass": "newobj",
          "patching_rect": [
            400,
            366,
            160,
            22
          ],
          "text": "prepend sourceselect"
        }
      },
      {
        "box": {
          "id": "rl",
          "maxclass": "comment",
          "patching_rect": [
            14,
            77,
            75,
            18
          ],
          "presentation": 1,
          "presentation_rect": [
            14,
            77,
            75,
            18
          ],
          "text": "Root",
          "textcolor": [
            0.65,
            0.72,
            0.67,
            1
          ]
        }
      },
      {
        "box": {
          "id": "gl",
          "maxclass": "comment",
          "patching_rect": [
            90,
            77,
            180,
            18
          ],
          "presentation": 1,
          "presentation_rect": [
            90,
            77,
            180,
            18
          ],
          "text": "Scale",
          "textcolor": [
            0.65,
            0.72,
            0.67,
            1
          ]
        }
      },
      {
        "box": {
          "id": "root_menu",
          "maxclass": "umenu",
          "patching_rect": [
            14,
            95,
            70,
            22
          ],
          "presentation": 1,
          "presentation_rect": [
            14,
            95,
            70,
            22
          ],
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
          "varname": "root_menu",
          "bgcolor": [
            0.26,
            0.3,
            0.27,
            1
          ],
          "textcolor": [
            0.86,
            0.9,
            0.86,
            1
          ]
        }
      },
      {
        "box": {
          "id": "root_menucmd",
          "maxclass": "newobj",
          "patching_rect": [
            400,
            462,
            160,
            22
          ],
          "text": "prepend rootselect"
        }
      },
      {
        "box": {
          "id": "scale_menu",
          "maxclass": "umenu",
          "patching_rect": [
            90,
            95,
            256,
            22
          ],
          "presentation": 1,
          "presentation_rect": [
            90,
            95,
            256,
            22
          ],
          "items": [
            "Major",
            ",",
            "Dorian",
            ",",
            "8-note Custom"
          ],
          "varname": "scale_menu",
          "bgcolor": [
            0.26,
            0.3,
            0.27,
            1
          ],
          "textcolor": [
            0.86,
            0.9,
            0.86,
            1
          ]
        }
      },
      {
        "box": {
          "id": "scale_menucmd",
          "maxclass": "newobj",
          "patching_rect": [
            400,
            510,
            160,
            22
          ],
          "text": "prepend scaleselect"
        }
      },
      {
        "box": {
          "id": "connection",
          "maxclass": "comment",
          "patching_rect": [
            14,
            122,
            332,
            19
          ],
          "presentation": 1,
          "presentation_rect": [
            12,
            75,
            340,
            38
          ],
          "varname": "connection",
          "text": "Waiting for Live API",
          "textcolor": [
            0.86,
            0.72,
            0.46,
            1
          ],
          "fontsize": 10
        }
      },
      {
        "box": {
          "id": "scale_status",
          "maxclass": "comment",
          "patching_rect": [
            14,
            144,
            332,
            20
          ],
          "presentation": 0,
          "presentation_rect": [
            14,
            112,
            332,
            20
          ],
          "varname": "scale_status",
          "text": "Load two copies to try Host / Follow",
          "textcolor": [
            0.74,
            0.81,
            0.75,
            1
          ],
          "fontsize": 10
        }
      },
      {
        "box": {
          "id": "song_anchor",
          "maxclass": "newobj",
          "text": "live.object",
          "varname": "song_anchor",
          "patching_rect": [
            300,
            360,
            80,
            22
          ],
          "saved_object_attributes": {
            "_persistence": 1
          }
        }
      },
      {
        "box": {
          "id": "song_out",
          "maxclass": "newobj",
          "text": "prepend anchor_set",
          "patching_rect": [
            300,
            400,
            150,
            22
          ]
        }
      },
      {
        "box": {
          "id": "midi",
          "maxclass": "newobj",
          "text": "js probe-midi.js",
          "patching_rect": [
            10,
            680,
            150,
            22
          ]
        }
      },
      {
        "box": {
          "id": "choice",
          "varname": "choice_menu",
          "maxclass": "umenu",
          "items": [
            "Choose device to keep identity"
          ],
          "patching_rect": [
            10,
            720,
            330,
            22
          ],
          "presentation": 1,
          "presentation_rect": [
            12,
            120,
            280,
            22
          ]
        }
      },
      {
        "box": {
          "id": "choicecmd",
          "maxclass": "newobj",
          "text": "prepend choose",
          "patching_rect": [
            350,
            720,
            100,
            22
          ]
        }
      },
      {
        "box": {
          "id": "refresh",
          "maxclass": "message",
          "text": "refresh",
          "patching_rect": [
            10,
            750,
            50,
            22
          ],
          "presentation": 1,
          "presentation_rect": [
            298,
            120,
            55,
            22
          ]
        }
      },
      {
        "box": {
          "id": "panic",
          "maxclass": "message",
          "text": "panic",
          "patching_rect": [
            80,
            750,
            50,
            22
          ],
          "presentation": 1,
          "presentation_rect": [
            298,
            145,
            55,
            20
          ]
        }
      }
    ],
    "lines": [
      {
        "patchline": {
          "source": [
            "ready",
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
            "status",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "host_toggle",
            0
          ],
          "destination": [
            "hostcmd",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "hostcmd",
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
            "source_menu",
            0
          ],
          "destination": [
            "source_menucmd",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "source_menucmd",
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
            "root_menu",
            0
          ],
          "destination": [
            "root_menucmd",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "root_menucmd",
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
            "scale_menu",
            0
          ],
          "destination": [
            "scale_menucmd",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "scale_menucmd",
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
            "song_anchor",
            0
          ],
          "destination": [
            "song_out",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "song_out",
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
            "mi",
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
            "mo",
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
            "midi",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "choice",
            0
          ],
          "destination": [
            "choicecmd",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "choicecmd",
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
            "refresh",
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
            "midi",
            0
          ]
        }
      }
    ],
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
          "sharing-prototype.js": {
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
    "dependency_cache": [
      {
        "name": "identity-master-fixture.js",
        "type": "TEXT",
        "implicit": 1
      }
    ],
    "bgcolor": [
      0.16,
      0.18,
      0.17,
      1
    ],
    "openrect": [
      0,
      0,
      680,
      169
    ],
    "parameters": {
      "store": [
        "Conflict Probe State",
        "Conflict State",
        0
      ]
    }
  }
}
