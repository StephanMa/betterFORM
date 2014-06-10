package de.betterform.agent.web.atmosphere;

/**
 * Created by joern on 05.06.14.
 */
/*
 * Copyright 2014 Jeanfrancois Arcand
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

import org.atmosphere.config.managed.Decoder;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

/**
 * Decode a String into a {@link Message}.
 */
public class JacksonDecoder implements Decoder<String, Message> {

    private final ObjectMapper mapper = new ObjectMapper();

    public Message decode(String s) {
        try {
            return mapper.readValue(s, Message.class);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}