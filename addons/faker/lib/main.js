/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Open Web Apps for Firefox.
 *
 * The Initial Developer of the Original Code is The Mozilla Foundation.
 * Portions created by the Initial Developer are Copyright (C) 2011
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *    Anant Narayanan <anant@kix.in>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

const self = require("self");
const pageMod = require("page-mod");
const {Cc, Ci, Cu} = require("chrome");
/**
 * Module to load manifests from data/fake/ to setup websites as apps.
 * Add a manifest to the directory, and append to the object here with origin
 * as key. (Alerntatively, we can move the origin into the manifest file itself
 * and enumerate the directory? In that we case we have to figure out how to
 * get the addon directory location in jetpack)
 */
var FAKE_APPS = {
    "http://nytimes.com": ["nytimes.manifest", "*.nytimes.com", "nytimes.js",
                           // set up the smooth transition stuff
                           'var head = document.getElementsByTagName("head")[0];' +
                           'var el = document.createElement("script");' +
                           'el.setAttribute("type", "text/javascript");' +
                           'el.setAttribute("src", "' + self.data.url("nytimes-inline.js") + '");' +
                           'head.appendChild(el);'],
    "http://twitter.com": ["twitter.manifest", "*.twitter.com", "twitter.js"],
    "http://chrome.angrybirds.com" : ["angrybirds.manifest", "*.angrybirds.com", "angrybirds.js"]
};


function injectAsInstallable()
{
    for (let origin in FAKE_APPS) {
        let contentScript = [
            'var head = document.getElementsByTagName("head")[0];' +
            'var el = document.createElement("link");' +
            'el.setAttribute("rel", "application-manifest");' +
            'el.setAttribute("href", "' +
            self.data.url(FAKE_APPS[origin][0]) + '");' +
            'head.appendChild(el);'
        ];
        if (FAKE_APPS[origin][3]) {
            contentScript.push(FAKE_APPS[origin][3]);
        }
        pageMod.PageMod({
            include: FAKE_APPS[origin][1],
            contentScriptFile: self.data.url(FAKE_APPS[origin][2]),
            contentScript: contentScript
        });
    }
}

injectAsInstallable();
